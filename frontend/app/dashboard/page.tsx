"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileUpload } from "@/components/dashboard/file-upload"
import { FileList } from "@/components/dashboard/file-list"
import { useFiles } from "@/hooks/use-files"

export default function DashboardPage() {
  const { files, uploadFile, getFileById, deleteFile, isLoading, uploadProgress } = useFiles()
  const [isUploading, setIsUploading] = useState(false)

  const handleUploadComplete = async (file: File) => {
    setIsUploading(true)
    try {
      await uploadFile(file)
    } finally {
      setIsUploading(false)
    }
  }

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

          {/* Componente para subir archivos */}
          <FileUpload
            onUploadComplete={handleUploadComplete}
            isLoading={isUploading || isLoading}
            progress={uploadProgress}
          />

          {/* Lista de archivos subidos en esta sesión */}
          <FileList
            files={files}
            onGetFile={getFileById} // 👉 retorna el Blob, vos decidís qué hacer con él
            onDelete={deleteFile}
          />
        </div>
      </main>
    </div>
  )
}
