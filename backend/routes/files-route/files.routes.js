// routes/files-route/files.routes.js
import express from 'express';
import protectRoute from '../../middleware/protectRoute.js';
import multer from 'multer';
import { uploadFile, getFile, deleteFile } from '../../controllers/files-controller/file.controller.js';

const router = express.Router();

// Multer setup for handling file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload file
router.post('/upload', protectRoute, upload.single('file'), uploadFile);

// Download file
router.get('/:id', protectRoute, getFile);

// Delete file
router.delete('/:id', protectRoute, deleteFile); 

export default router;
