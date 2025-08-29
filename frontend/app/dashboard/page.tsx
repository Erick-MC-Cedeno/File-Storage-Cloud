"use client"

import { useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { FileUpload } from "@/components/dashboard/file-upload"
import { FileList } from "@/components/dashboard/file-list"
import { useFiles } from "@/hooks/use-files"

export default function DashboardPage() {
  const { files, isLoading, fetchFiles, downloadFile } = useFiles()

  const handleUploadComplete = () => {
    // Upload completed
    fetchFiles() // Refresca la lista después de subir archivos
  }

  const handleDownloadClick = async (id: string, filename: string) => {
    try {
      await downloadFile(id, filename)
    } catch (error) {
      // Download failed
    }
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div className="min-h-screen bg-background neon-dashboard">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-1 rounded-lg bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-cyan-500/30">
              <div className="bg-background/80 backdrop-blur-sm rounded-md px-6 py-4">
                <h2 className="text-4xl font-bold tracking-tight mb-2 neon-title">NEURAL DASHBOARD</h2>
                <p className="text-muted-foreground neon-subtitle text-lg">
                  // Quantum file management system initialized
                </p>
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <div
                    className="w-2 h-2 bg-green-400 rounded-full animate-pulse"
                    style={{ boxShadow: "0 0 10px rgba(0,255,65,0.8)" }}
                  ></div>
                  <span className="text-xs text-green-400 font-mono">SYSTEM ONLINE</span>
                </div>
              </div>
            </div>
          </div>

          <FileUpload onUploadComplete={handleUploadComplete} />

          <FileList files={files} />
        </div>
      </main>
    </div>
  )
}
