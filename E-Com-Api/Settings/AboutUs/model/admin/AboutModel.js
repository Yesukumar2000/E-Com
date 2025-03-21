import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  content: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('About', aboutSchema);
