"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import { filesApi, type FileItem } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface UploadQueueItem {
  file: File
  id: string
}

export function useFiles() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const { toast } = useToast()

  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([])
  const [currentUpload, setCurrentUpload] = useState<string | null>(null)
  const isProcessingQueue = useRef(false)
  const queueRef = useRef<UploadQueueItem[]>([])

  const fetchFiles = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await filesApi.getAll()
      setFiles(response.files || [])
    } catch (error) {
      console.error("Error fetching files:", error)
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchFiles()
  }, []) // Empty dependency array to run only once on mount

  const processUploadQueue = useCallback(async () => {
    if (isProcessingQueue.current) return

    isProcessingQueue.current = true
    setIsLoading(true)

    while (queueRef.current.length > 0) {
      const item = queueRef.current[0]
      setCurrentUpload(item.id)
      setUploadProgress(0)

      try {
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev === null) return 10
            if (prev >= 90) return prev
            return prev + 10
          })
        }, 200)

        const response = await filesApi.upload(item.file)
        clearInterval(progressInterval)
        setUploadProgress(100)

        if (response.data) {
          const fileItem: FileItem = {
            id: response.data.id,
            filename: response.data.filename,
            originalName: item.file.name,
            mimetype: item.file.type,
            size: item.file.size,
            uploadedAt: new Date().toISOString(),
            userId: response.data.userId || "",
          }

          setFiles((prev) => [fileItem, ...prev])
          toast({
            title: "Success",
            description: `${item.file.name} uploaded successfully`,
          })
        }

        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error("Upload error:", error)
        toast({
          title: "Upload Failed",
          description: `${item.file.name}: ${error instanceof Error ? error.message : "Upload failed"}`,
          variant: "destructive",
        })
      }

      queueRef.current = queueRef.current.slice(1)
      setUploadQueue((prev) => prev.slice(1))
      setUploadProgress(null)
    }

    setCurrentUpload(null)
    setIsLoading(false)
    isProcessingQueue.current = false

    // Files are already updated locally when uploaded successfully
  }, [toast])

  const uploadFiles = useCallback(
    async (files: File[]) => {
      if (!files || !Array.isArray(files) || files.length === 0) {
        console.warn("No files provided to uploadFiles")
        return
      }

      const newItems = files.map((file) => ({
        file,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      }))

      queueRef.current = [...queueRef.current, ...newItems]
      setUploadQueue((prev) => [...prev, ...newItems])

      setTimeout(() => {
        if (!isProcessingQueue.current) {
          processUploadQueue()
        }
      }, 0)
    },
    [processUploadQueue],
  )

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

  const downloadFile = useCallback(
    async (id: string, filename: string) => {
      try {
        const blob = await filesApi.getById(id)

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = filename
        document.body.appendChild(link)
        link.click()

        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)

        toast({
          title: "Success",
          description: `${filename} downloaded successfully`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Download failed",
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
    uploadFile: uploadFiles,
    uploadFiles,
    uploadQueue: uploadQueue.length,
    currentUpload,
    getFileById,
    deleteFile,
    downloadFile,
    fetchFiles,
  }
}
