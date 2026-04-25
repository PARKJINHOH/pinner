export interface RegisterRequest {
  email: string
  password: string
  nickname: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RefreshRequest {
  refreshToken: string
}

export interface LogoutRequest {
  refreshToken: string
}

export interface RegisterResponse {
  userId: number
  email: string
  nickname: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  userId: number
  email: string
  nickname: string
}

export interface TokenResponse {
  accessToken: string
}

export interface UserInfoResponse {
  userId: number
  email: string
  nickname: string
  provider: string
}
