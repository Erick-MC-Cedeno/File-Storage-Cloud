// API configuration and base functions
const API_BASE_URL = "https://ominous-space-broccoli-9rq7959qwxj3p7j9-4000.app.github.dev/api"

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
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  const logBody = config.body
    ? (() => {
        try {
          const parsed = JSON.parse(config.body as string)
          const filtered = { ...parsed }
          if (filtered.password) filtered.password = "***HIDDEN***"
          if (filtered.confirmPassword) filtered.confirmPassword = "***HIDDEN***"
          return JSON.stringify(filtered)
        } catch {
          return config.body
        }
      })()
    : undefined

  console.log("[v0] API Request:", {
    url,
    method: config.method || "GET",
    headers: config.headers,
    body: logBody,
  })

  try {
    const response = await fetch(url, config)

    console.log("[v0] API Response:", {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: "Network error" }))
      console.log("[v0] API Error Data:", errorData)
      throw new Error(errorData?.message ?? `HTTP error! status: ${response.status}`)
    }

    const responseData = await response.json()
    console.log("[v0] API Success Data:", responseData)
    return responseData
  } catch (error) {
    console.error("[v0] API Error:", error)
    throw error
  }
}

// Auth API functions
export const authApi = {
  signup: async (data: {
    fullName: string
    username: string
    password: string
    confirmPassword: string
    gender: string
  }): Promise<any> => {
    const logData = { ...data, password: "***HIDDEN***", confirmPassword: "***HIDDEN***" }
    console.log("[v0] Signup data being sent:", logData)

    if (!data.fullName || !data.username || !data.password || !data.gender) {
      throw new Error("All fields are required")
    }

    return apiFetch("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  login: async (data: { username: string; password: string }): Promise<AuthResponse> => {
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
      headers: {}, // Remove Content-Type for FormData
      body: formData,
    })
  },

  getById: async (id: string): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      credentials: "include",
    })
    if (!response.ok) {
      throw new Error("Failed to get file")
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
