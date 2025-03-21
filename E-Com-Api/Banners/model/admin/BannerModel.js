import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema({
  banner_Type: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: false }, // stored image 
  scrollOrderNo: { type: Number, required: true },
  status: { type: Number, default: 1 }       // 1 = active, 0 = inactive (soft delete)
}, { timestamps: true });

bannerSchema.index({ banner_Type: 1, scrollOrderNo: 1 }, { unique: true });

export default mongoose.model('Banner', bannerSchema);
