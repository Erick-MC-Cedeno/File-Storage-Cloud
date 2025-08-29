import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import File from "../../models/files-schemas/files-schemas.js"

// Upload file
const uploadFile = async (req, res) => {
  try {
    const file = req.file
    const userId = req.user._id

    if (!file) return res.status(400).json({ message: "No file uploaded" })

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/svg+xml",
      "image/webp",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ message: "Tipo de archivo no permitido" })
    }

    const uniqueFileName = `${uuidv4()}-${file.originalname}`
    const uploadDir = path.join(process.cwd(), "uploads/files")

    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, uniqueFileName)
    fs.writeFileSync(filePath, file.buffer)

    const fileDoc = new File({
      fileName: uniqueFileName,
      originalName: file.originalname,
      filePath,
      userId,
      mimetype: file.mimetype,
      size: file.size,
    })
    await fileDoc.save()

    res.status(201).json({ message: "Archivo subido correctamente", fileId: fileDoc._id, fileName: uniqueFileName })
  } catch (error) {
    console.error("Error in uploadFile:", error.message)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

// Download file
const getFile = async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id)
    if (!fileDoc) return res.status(404).json({ message: "Archivo no encontrado" })

    res.download(fileDoc.filePath, fileDoc.fileName)
  } catch (error) {
    console.error("Error in getFile:", error.message)
    res.status(500).json({ message: "Error interno del servidor" })
  }
}

// Delete file
const deleteFile = async (req, res) => {
  try {
    const fileDoc = await File.findById(req.params.id)
    if (!fileDoc) return res.status(404).json({ message: "File not found" })

    // Eliminar archivo físico
    if (fs.existsSync(fileDoc.filePath)) fs.unlinkSync(fileDoc.filePath)

    // Eliminar de DB
    await File.findByIdAndDelete(req.params.id)

    res.status(200).json({ message: "File deleted successfully" })
  } catch (error) {
    console.error("Error in deleteFile:", error.message)
    res.status(500).json({ message: "Internal server error" })
  }
}

// Get all files for user
const getAllFiles = async (req, res) => {
  try {
    const userId = req.user._id
    const files = await File.find({ userId })
      .select("_id fileName originalName mimetype size createdAt")
      .sort({ createdAt: -1 })

    // Transform files to match frontend FileItem interface
    const transformedFiles = files.map((file) => ({
      id: file._id.toString(),
      filename: file.fileName,
      originalName: file.originalName || file.fileName,
      mimetype: file.mimetype || "application/octet-stream",
      size: file.size || 0,
      uploadedAt: file.createdAt,
      userId: file.userId?.toString?.() || undefined,
    }))

    res.status(200).json({
      success: true,
      data: transformedFiles,
      message: "Files retrieved successfully",
    })
  } catch (error) {
    console.error("Error in getAllFiles:", error.message)
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    })
  }
}

export { uploadFile, getFile, deleteFile, getAllFiles }
