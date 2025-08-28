import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  fileName: String,
  filePath: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  mimetype: String,
  createdAt: { type: Date, default: Date.now }
});

const File = mongoose.model('File', fileSchema);

console.log('File model created:', File);

export default File;