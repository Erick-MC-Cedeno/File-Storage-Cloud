"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useFiles } from "@/hooks/use-files"
import type { FileItem } from "@/lib/api"
import { Download, Trash2, FileIcon, ImageIcon, VideoIcon, FileTextIcon, Database, Check, X } from "lucide-react"
import { formatBytes, formatDate } from "@/lib/utils"

interface FileListProps {
  files: FileItem[]
}

export function FileList({ files }: FileListProps) {
  const { downloadFile, deleteFile } = useFiles()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null)

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith("image/")) return ImageIcon
    if (mimetype.startsWith("video/")) return VideoIcon
    if (mimetype.includes("text") || mimetype.includes("document")) return FileTextIcon
    return FileIcon
  }

  const getFileTypeColor = (mimetype: string) => {
    if (mimetype.startsWith("image/")) return "from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400"
    if (mimetype.startsWith("video/")) return "from-purple-500/20 to-violet-500/20 border-purple-500/30 text-purple-400"
    if (mimetype.includes("text") || mimetype.includes("document"))
      return "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400"
    return "from-gray-500/20 to-slate-500/20 border-gray-500/30 text-gray-400"
  }

  const handleDownload = async (file: FileItem) => {
    await downloadFile(file.id, file.originalName)
  }

  const handleDeleteClick = (id: string) => {
    setConfirmingDeleteId(id)
  }

  const handleConfirmDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteFile(id)
    } finally {
      setDeletingId(null)
      setConfirmingDeleteId(null)
    }
  }

  const handleCancelDelete = () => {
    setConfirmingDeleteId(null)
  }

  if (files.length === 0) {
    return (
      <Card className="neon-card">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="relative mb-6">
            <Database
              className="h-16 w-16 text-cyan-400/50"
              style={{ filter: "drop-shadow(0 0 15px rgba(0,255,255,0.3))" }}
            />
            <div className="absolute -inset-4 border border-cyan-500/20 rounded-full animate-pulse"></div>
          </div>
          <p className="text-xl font-bold neon-title mb-2">NO DATA FOUND</p>
          <p className="text-sm neon-subtitle">// Initialize neural storage by uploading your first file</p>
          <div className="mt-4 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-md">
            <span className="text-xs font-mono text-cyan-400">STORAGE: READY</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="neon-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3">
          <Database className="h-5 w-5 text-cyan-400" />
          <span className="neon-title">NEURAL STORAGE ({files.length})</span>
          <div className="flex-1"></div>
          <div className="px-2 py-1 bg-green-500/10 border border-green-500/30 rounded-md">
            <span className="text-xs font-mono text-green-400">ACTIVE</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {files.map((file, idx) => {
            const FileIconComponent = getFileIcon(file.mimetype)
            const delay = `${idx * 100}ms`
            const colorClasses = getFileTypeColor(file.mimetype)

            return (
              <div
                key={file.id}
                className="flex items-center justify-between border rounded-lg neon-card file-item-compact hover:scale-[1.02] transition-all duration-300 p-4"
                style={{ animationDelay: delay }}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div className="relative flex items-center justify-center">
                    <FileIconComponent
                      className="file-icon flex-shrink-0"
                      style={{ filter: "drop-shadow(0 0 8px rgba(0,255,65,0.5))" }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="file-name font-medium truncate font-mono" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <div className="flex items-center space-x-3 mt-1 file-meta">
                      <span
                        className={`px-2 py-1 rounded-md text-xs font-bold bg-gradient-to-r ${colorClasses} border`}
                      >
                        {file.mimetype.split("/")[1]?.toUpperCase() || "FILE"}
                      </span>
                      <span className="text-cyan-400/80 font-mono text-xs">{formatBytes(file.size)}</span>
                      <span className="text-purple-400/80 font-mono text-xs">{formatDate(file.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-2 flex-shrink-0 self-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDownload(file)}
                    className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/20 transition-all duration-300 h-8 w-8 p-0 flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 text-cyan-400" />
                  </Button>

                  {confirmingDeleteId === file.id ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleConfirmDelete(file.id)}
                        disabled={deletingId === file.id}
                        className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 hover:border-green-500/60 hover:bg-green-500/20 transition-all duration-300 h-8 w-8 p-0 flex items-center justify-center"
                      >
                        <Check className="h-4 w-4 text-green-400" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelDelete}
                        className="bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-500/30 hover:border-gray-500/60 hover:bg-gray-500/20 transition-all duration-300 h-8 w-8 p-0 flex items-center justify-center"
                      >
                        <X className="h-4 w-4 text-gray-400" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(file.id)}
                      className="bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/20 transition-all duration-300 h-8 w-8 p-0 flex items-center justify-center"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
