"use client"

import { useState, useCallback } from "react"
import { filesApi, type FileItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const { toast } = useToast()

  const uploadFile = useCallback(
    async (file: File) => {
      setIsLoading(true)
      setUploadProgress(0)

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev === null) return 10
            if (prev >= 90) return prev
            return prev + 10
          })
        }, 200)

        const response = await filesApi.upload(file)

        clearInterval(progressInterval)
        setUploadProgress(100)

        if (response.success && response.data) {
          setFiles((prev) => [response.data!, ...prev])
          toast({
            title: "Success",
            description: "File uploaded successfully",
          })

          setTimeout(() => setUploadProgress(null), 1000)
        } else {
          throw new Error(response.message || "Upload failed")
        }
      } catch (error) {
        setUploadProgress(null)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Upload failed",
          variant: "destructive",
        })
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [toast],
  )

  const downloadFile = useCallback(
    async (id: string, filename: string) => {
      try {
        const blob = await filesApi.download(id)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Success",
          description: "File downloaded successfully",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to download file",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  const deleteFile = useCallback(
    async (id: string) => {
      try {
        const response = await filesApi.delete(id)
        if (response.success) {
          setFiles((prev) => prev.filter((file) => file.id !== id))
          toast({
            title: "Success",
            description: "File deleted successfully",
          })
        } else {
          throw new Error(response.message || "Delete failed")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Delete failed",
          variant: "destructive",
        })
      }
    },
    [toast],
  )

  return {
    files,
    setFiles,
    isLoading,
    uploadProgress,
    uploadFile,
    downloadFile,
    deleteFile,
  }
}
