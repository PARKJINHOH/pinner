import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../shared/store/authStore'
import { authService } from '../services'
import type { LoginRequest, RegisterRequest } from '../types'

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const login = async (data: LoginRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await authService.login(data)
      setAuth(res)
      navigate('/main')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? '로그인에 실패했습니다'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return { login, isLoading, error }
}

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const register = async (data: RegisterRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      await authService.register(data)
      navigate('/login')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        ?? '회원가입에 실패했습니다'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return { register, isLoading, error }
}

export function useLogout() {
  const { refreshToken, clearAuth } = useAuthStore()
  const navigate = useNavigate()

  const logout = async () => {
    if (refreshToken) {
      try {
        await authService.logout({ refreshToken })
      } catch {
        // server-side deletion failed — clear client state anyway
      }
    }
    clearAuth()
    navigate('/login')
  }

  return { logout }
}
