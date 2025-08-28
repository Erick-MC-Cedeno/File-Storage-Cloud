"use client"

import React, { useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileUpload } from "@/components/dashboard/file-upload"
import { FileList } from "@/components/dashboard/file-list"
import { useFiles } from "@/hooks/use-files"

export default function DashboardPage() {
  const { files, isLoading, fetchFiles, downloadFile } = useFiles()

  const handleUploadComplete = () => {
    console.log("Upload completed successfully")
    fetchFiles() // Refresca la lista después de subir archivos
  }

  const handleDownloadClick = async (id: string, filename: string) => {
    try {
      await downloadFile(id, filename)
      console.log("Downloaded file:", id, filename)
    } catch (error) {
      console.error("Download failed:", error)
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h2>
            <p className="text-muted-foreground">
              Upload, manage, and organize your files in the cloud.
            </p>
          </div>

          <FileUpload onUploadComplete={handleUploadComplete} />

          <FileList files={files} onDownloadClick={handleDownloadClick} />
        </div>
      </main>
    </div>
  )
}
