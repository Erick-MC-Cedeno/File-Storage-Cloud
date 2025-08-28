"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useFiles } from "@/hooks/use-files"
import { Upload, FileIcon, Clock } from "lucide-react"
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
    <Card className="w-full">
      <CardContent className="p-6">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            isLoading && "cursor-not-allowed opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            {isLoading ? (
              <FileIcon className="h-12 w-12 text-muted-foreground animate-pulse" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground" />
            )}

            {isLoading ? (
              <div className="space-y-2 w-full max-w-xs">
                <p className="text-sm text-muted-foreground">
                  {uploadQueue > 0 ? `Uploading... (${uploadQueue} files in queue)` : "Uploading..."}
                </p>
                {uploadProgress !== null && <Progress value={uploadProgress} className="w-full" />}
                {uploadQueue > 1 && (
                  <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Processing files sequentially to avoid rate limits</span>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <p className="text-lg font-medium">{isDragActive ? "Drop files here" : "Upload your files"}</p>
                  <p className="text-sm text-muted-foreground">Drag and drop files here, or click to select files</p>
                  <p className="text-xs text-muted-foreground">Multiple files will be uploaded sequentially</p>
                </div>
                <Button variant="outline" disabled={isLoading}>
                  Select Files
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
