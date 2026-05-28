import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  userId: number | null
  email: string | null
  nickname: string | null
  isAuthenticated: boolean
  isDemo: boolean
  setAuth: (data: {
    accessToken: string
    refreshToken: string
    userId: number
    email: string
    nickname: string
    isDemo: boolean
  }) => void
  setAccessToken: (accessToken: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      nickname: null,
      isAuthenticated: false,
      isDemo: false,

      setAuth: (data) => set({ ...data, isAuthenticated: true }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          email: null,
          nickname: null,
          isAuthenticated: false,
          isDemo: false,
        }),
    }),
    { name: 'pinner-auth' }
  )
)
