import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const axiosInstance = axios.create({
  baseURL: '/api',
})

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // FormData 전송 시 Content-Type을 완전히 제거해야
  // 브라우저/fetch가 multipart/form-data; boundary=... 를 자동 설정함
  // axios의 전역 기본값 headers.post['Content-Type'] = 'application/json'이
  // axios.create() 설정 제거와 무관하게 POST 요청에 적용되므로 여기서 명시적으로 삭제
  if (config.data instanceof FormData) {
    config.headers.delete('Content-Type')
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return axiosInstance(originalRequest)
        })
        .catch((err) => Promise.reject(err))
    }

    originalRequest._retry = true
    isRefreshing = true

    const { refreshToken, setAccessToken, clearAuth } = useAuthStore.getState()

    if (!refreshToken) {
      isRefreshing = false
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const { data } = await axios.post('/api/auth/refresh', { refreshToken })
      const newAccessToken: string = data.data.accessToken
      setAccessToken(newAccessToken)
      processQueue(null, newAccessToken)
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return axiosInstance(originalRequest)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  }
)

export default axiosInstance
