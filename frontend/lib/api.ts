// API configuration and base functions
const API_BASE_URL = "https://stunning-zebra-9rq7959q59v29xpv-4000.app.github.dev/api"

export interface User {
  id: string
  fullName: string
  username: string
  gender: string
  createdAt: string
}

export interface FileItem {
  id: string
  filename: string
  originalName: string
  mimetype: string
  size: number
  uploadedAt: string
  userId: string
}

export interface AuthResponse {
  success: boolean
  message: string
  user?: User
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
}

// Base fetch function with error handling
async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const config: RequestInit = {
    credentials: "include", // Include cookies for authentication
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("API Error:", error)
    throw error
  }
}

// Auth API functions
export const authApi = {
  signup: async (data: {
    fullName: string
    username: string
    password: string
    gender: string
  }): Promise<AuthResponse> => {
    return apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  login: async (data: {
    username: string
    password: string
  }): Promise<AuthResponse> => {
    return apiFetch("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  logout: async (): Promise<ApiResponse> => {
    return apiFetch("/auth/logout", {
      method: "POST",
    })
  },
}

// User API functions
export const userApi = {
  getUsers: async (): Promise<ApiResponse<User[]>> => {
    return apiFetch("/user")
  },
}

// Files API functions
export const filesApi = {
  upload: async (file: File): Promise<ApiResponse<FileItem>> => {
    const formData = new FormData()
    formData.append("file", file)

    return apiFetch("/files/upload", {
      method: "POST",
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    })
  },

  download: async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      credentials: "include",
    })

    if (!response.ok) {
      throw new Error("Failed to download file")
    }

    return response.blob()
  },

  delete: async (id: string): Promise<ApiResponse> => {
    return apiFetch(`/files/${id}`, {
      method: "DELETE",
    })
  },
}

// Health check
export const healthApi = {
  check: async (): Promise<ApiResponse> => {
    return fetch(`${API_BASE_URL.replace("/api", "")}/health`, {
      credentials: "include",
    }).then((res) => res.json())
  },
}
