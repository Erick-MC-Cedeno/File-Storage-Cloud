"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { authApi, type User } from "@/lib/api"

const cookieStorage = {
  getItem: (name: string): string | null => {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null
    return null
  },
  setItem: (name: string, value: string): void => {
    if (typeof document === "undefined") return
    document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 7}` // 7 days
  },
  removeItem: (name: string): void => {
    if (typeof document === "undefined") return
    document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT`
  },
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (data: {
    fullName: string
    username: string
    password: string
    confirmPassword: string
    gender: string
  }) => Promise<void>
  logout: () => Promise<void>
  clearAuth: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (username: string, password: string) => {
        set({ isLoading: true })
        try {
          const userData = await authApi.login({ username, password })

          // Map server response to User interface
          const user: User = {
            id: userData._id || userData.id,
            fullName: userData.fullName,
            username: userData.username,
            gender: userData.gender,
            createdAt: userData.createdAt || new Date().toISOString(),
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signup: async (data) => {
        set({ isLoading: true })
        try {
          const userData = await authApi.signup(data)

          // Map server response to User interface
          const user: User = {
            id: userData._id || userData.id,
            fullName: userData.fullName,
            username: userData.username,
            gender: userData.gender || data.gender,
            createdAt: userData.createdAt || new Date().toISOString(),
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      logout: async () => {
        set({ isLoading: true })
        try {
          await authApi.logout()
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
          window.location.reload()
        } catch (error) {
          // Even if logout fails on server, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
          window.location.reload()
        }
      },

      clearAuth: () => {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
