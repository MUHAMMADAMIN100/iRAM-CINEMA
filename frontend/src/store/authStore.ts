import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../api/axios'
import { User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>
  logout: () => void
  fetchMe: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/login', { email, password })
        localStorage.setItem('token', data.access_token)
        set({ token: data.access_token, isLoading: false })
        const me = await api.get('/auth/me')
        set({ user: me.data })
      },

      register: async (name, email, password, phone) => {
        set({ isLoading: true })
        const { data } = await api.post('/auth/register', { name, email, password, phone })
        localStorage.setItem('token', data.access_token)
        set({ token: data.access_token, isLoading: false })
        const me = await api.get('/auth/me')
        set({ user: me.data })
      },

      logout: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null })
      },

      fetchMe: async () => {
        try {
          const { data } = await api.get('/auth/me')
          set({ user: data })
        } catch {
          set({ user: null, token: null })
        }
      },
    }),
    { name: 'auth-store', partialize: (s) => ({ token: s.token }) }
  )
)
