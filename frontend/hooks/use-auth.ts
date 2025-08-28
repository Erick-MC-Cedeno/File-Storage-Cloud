"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { authApi, type User } from "@/lib/api"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  signup: (data: {
    fullName: string
    username: string
    password: string
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
          const response = await authApi.login({ username, password })
          if (response.success && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            throw new Error(response.message || "Login failed")
          }
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },

      signup: async (data) => {
        set({ isLoading: true })
        try {
          const response = await authApi.signup(data)
          if (response.success && response.user) {
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            throw new Error(response.message || "Signup failed")
          }
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
        } catch (error) {
          // Even if logout fails on server, clear local state
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
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
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
