import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: String,
  originalName: String,
  filePath: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mimetype: String,
  size: Number,
  createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

export default File;