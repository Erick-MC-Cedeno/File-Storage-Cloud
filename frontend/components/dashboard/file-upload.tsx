"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFiles } from "@/hooks/use-files"
import { Upload, FileIcon, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadProps {
  onUploadComplete?: () => void
}

export function FileUpload({ onUploadComplete }: FileUploadProps) {
  const { uploadFiles, isLoading, uploadProgress, uploadQueue, currentUpload } = useFiles()

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        await uploadFiles(acceptedFiles)
        onUploadComplete?.()
      } catch (error) {
        console.error("Upload failed:", error)
      }
    },
    [uploadFiles, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled: isLoading,
    multiple: true,
  })

  return (
    <Card className="w-full neon-card">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 neon-upload",
            isDragActive ? "border-pink-500/60 bg-pink-500/5 scale-105" : "border-cyan-500/40",
            isLoading && "cursor-not-allowed opacity-70",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {isLoading ? (
                <div className="relative">
                  <FileIcon
                    className="h-12 w-12 text-cyan-400 animate-pulse"
                    style={{ filter: "drop-shadow(0 0 10px rgba(0,255,255,0.6))" }}
                  />
                  <div className="absolute -inset-2 border-2 border-cyan-400/30 rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="relative group">
                  <Upload
                    className="h-12 w-12 text-cyan-400 group-hover:text-pink-400 transition-colors duration-300"
                    style={{ filter: "drop-shadow(0 0 10px rgba(0,255,255,0.6))" }}
                  />
                  <Zap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3 w-full max-w-sm">
                <div className="text-center">
                  <p className="text-lg font-medium neon-title">
                    {uploadQueue > 0 ? `UPLOADING... (${uploadQueue} FILES IN QUEUE)` : "UPLOADING..."}
                  </p>
                  <p className="text-sm neon-subtitle">// Neural transfer in progress</p>
                </div>
                {uploadProgress !== null && (
                  <div className="space-y-2">
                    <Progress value={uploadProgress} className="w-full h-2 bg-background border border-cyan-500/30" />
                    <p className="text-xs text-center text-cyan-400 font-mono">{uploadProgress.toFixed(1)}% COMPLETE</p>
                  </div>
                )}
                {uploadQueue > 1 && (
                  <div className="flex items-center justify-center space-x-2 text-xs neon-subtitle">
                    <Clock className="h-3 w-3" />
                    <span>SEQUENTIAL PROCESSING ACTIVE</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xl font-bold neon-title">
                    {isDragActive ? "// DROP FILES TO UPLOAD" : "QUANTUM FILE TRANSFER"}
                  </p>
                  <p className="text-sm neon-subtitle">Drag and drop files here, or click to select files</p>
                  <p className="text-xs text-muted-foreground font-mono">
                    // Multiple files will be processed sequentially
                  </p>
                </div>
                <Button
                  variant="outline"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border-cyan-500/30 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all duration-300"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  SELECT FILES
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
