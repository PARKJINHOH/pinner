import axiosInstance from '../../../shared/api/axiosInstance'
import type {
  AuthResponse,
  LoginRequest,
  LogoutRequest,
  RefreshRequest,
  RegisterRequest,
  RegisterResponse,
  TokenResponse,
  UserInfoResponse,
} from '../types'

export const authService = {
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const res = await axiosInstance.post('/auth/register', data)
    return res.data.data
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await axiosInstance.post('/auth/login', data)
    return res.data.data
  },

  refresh: async (data: RefreshRequest): Promise<TokenResponse> => {
    const res = await axiosInstance.post('/auth/refresh', data)
    return res.data.data
  },

  logout: async (data: LogoutRequest): Promise<void> => {
    await axiosInstance.post('/auth/logout', data)
  },

  me: async (): Promise<UserInfoResponse> => {
    const res = await axiosInstance.get('/auth/me')
    return res.data.data
  },

  demoLogin: async (): Promise<AuthResponse> => {
    const res = await axiosInstance.post('/auth/demo')
    return res.data.data
  },
}
