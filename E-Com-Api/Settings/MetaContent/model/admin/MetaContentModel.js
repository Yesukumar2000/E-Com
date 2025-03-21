import mongoose from 'mongoose';

const metaContentSchema = new mongoose.Schema({
  metaTitle: { type: String, required: true },
  metaDescription: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('MetaContent', metaContentSchema);
