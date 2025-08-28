import express from 'express';
import protectRoute from '../../middleware/protectRoute.js';
import multer from 'multer';
import { uploadFile, getFile, deleteFile } from '../../controllers/files-controller/file.controller.js';

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({ storage });

router.post('/upload', protectRoute, upload.single('file'), uploadFile);

router.get('/:id', protectRoute, getFile);

router.delete('/:id', protectRoute, deleteFile); 

export default router;
