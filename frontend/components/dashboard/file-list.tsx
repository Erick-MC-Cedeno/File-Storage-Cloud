"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useFiles } from "@/hooks/use-files"
import type { FileItem } from "@/lib/api"
import { Download, Trash2, FileIcon, ImageIcon, VideoIcon, FileTextIcon } from "lucide-react"
import { formatBytes, formatDate } from "@/lib/utils"

interface FileListProps {
  files: FileItem[]
}

export function FileList({ files }: FileListProps) {
  const { downloadFile, deleteFile } = useFiles()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith("image/")) return ImageIcon
    if (mimetype.startsWith("video/")) return VideoIcon
    if (mimetype.includes("text") || mimetype.includes("document")) return FileTextIcon
    return FileIcon
  }

  const getFileTypeColor = (mimetype: string) => {
    if (mimetype.startsWith("image/")) return "bg-green-100 text-green-800"
    if (mimetype.startsWith("video/")) return "bg-purple-100 text-purple-800"
    if (mimetype.includes("text") || mimetype.includes("document")) return "bg-blue-100 text-blue-800"
    return "bg-gray-100 text-gray-800"
  }

  const handleDownload = async (file: FileItem) => {
    await downloadFile(file.id, file.originalName)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteFile(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No files uploaded yet</p>
          <p className="text-sm text-muted-foreground">Upload your first file to get started</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Files ({files.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {files.map((file) => {
            const FileIconComponent = getFileIcon(file.mimetype)

            return (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <FileIconComponent className="h-8 w-8 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate" title={file.originalName}>
                      {file.originalName}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className={getFileTypeColor(file.mimetype)}>
                        {file.mimetype.split("/")[1]?.toUpperCase() || "FILE"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{formatBytes(file.size)}</span>
                      <span className="text-sm text-muted-foreground">{formatDate(file.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <Button variant="outline" size="sm" onClick={() => handleDownload(file)}>
                    <Download className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" disabled={deletingId === file.id}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete File</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{file.originalName}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(file.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
