"use client"

import { useEffect, useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileUpload } from "@/components/dashboard/file-upload"
import { FileList } from "@/components/dashboard/file-list"
import { useFiles } from "@/hooks/use-files"

export default function DashboardPage() {
  const { files, setFiles } = useFiles()
  const [isLoading, setIsLoading] = useState(true)

  // In a real app, you would fetch files from the server
  // For now, we'll use the files from the hook state
  useEffect(() => {
    // Simulate loading files from server
    const loadFiles = async () => {
      try {
        // Here you would typically fetch files from your API
        // const response = await filesApi.getFiles();
        // setFiles(response.data || []);
        setIsLoading(false)
      } catch (error) {
        console.error("Failed to load files:", error)
        setIsLoading(false)
      }
    }

    loadFiles()
  }, [setFiles])

  const handleUploadComplete = () => {
    // Files are automatically updated in the useFiles hook
    // This callback can be used for additional actions if needed
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your files...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
            <p className="text-muted-foreground">Upload, manage, and organize your files in the cloud.</p>
          </div>

          <FileUpload onUploadComplete={handleUploadComplete} />

          <FileList files={files} />
        </div>
      </main>
    </div>
  )
}
