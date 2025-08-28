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

        // 🚀 Adaptar a la respuesta de tu backend (fileId y fileName)
        if (response.fileId && response.fileName) {
          const fileItem: FileItem = {
            id: response.fileId,
            filename: response.fileName,
            originalName: file.name,
            mimetype: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            userId: "", // opcional, depende de lo que devuelva el backend
          }

          setFiles((prev) => [fileItem, ...prev])
          toast({
            title: "Success",
            description: "File uploaded successfully",
          })

          setTimeout(() => setUploadProgress(null), 1000)
        } else {
          throw new Error("Invalid server response")
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

  // 👉 solo trae el archivo por ID (no descarga automáticamente)
  const getFileById = useCallback(
    async (id: string): Promise<Blob | null> => {
      try {
        const blob = await filesApi.getById(id)
        return blob
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch file",
          variant: "destructive",
        })
        return null
      }
    },
    [toast],
  )

  const deleteFile = useCallback(
    async (id: string) => {
      try {
        const response = await filesApi.delete(id)
        setFiles((prev) => prev.filter((file) => file.id !== id))
        toast({
          title: "Success",
          description: response.message || "File deleted successfully",
        })
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
    getFileById, // retorna el Blob
    deleteFile,
  }
}
