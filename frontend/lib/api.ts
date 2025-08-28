// API configuration and base functions
const API_BASE_URL = "https://curly-journey-x795wpw94v42qjq-4000.app.github.dev/api"

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

// Base fetch function with error handling and retry logic
async function apiFetch<T = any>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const maxRetries = 3
  const baseDelay = 1000 // 1 second

  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (response.status === 429) {
      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount) + Math.random() * 1000 // Add jitter

        await new Promise((resolve) => setTimeout(resolve, delay))
        return apiFetch(endpoint, options, retryCount + 1)
      } else {
        throw new Error("Too many requests. Please wait a moment before uploading more files.")
      }
    }

    if (!response.ok) {
      let errorData: any
      try {
        errorData = await response.json()
      } catch (parseError) {
        errorData = { message: `HTTP error! status: ${response.status}` }
      }

      throw new Error(errorData?.message ?? `HTTP error! status: ${response.status}`)
    }

    let responseData: T
    try {
      responseData = await response.json()
    } catch (parseError) {
      throw new Error("Invalid response format from server")
    }

    return responseData
  } catch (error) {
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

  getAll: async (): Promise<{ files: FileItem[] }> => {
    return apiFetch("/files")
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
