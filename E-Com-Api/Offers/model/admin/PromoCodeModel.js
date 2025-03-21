import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  maxDiscountPrice: { type: Number, required: true },
  minOrderPrice: { type: Number, required: true },
  usePerUser: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  status: { type: Number, default: 1 } // 1 = active, 0 = inactive (soft delete)
}, { timestamps: true });

export default mongoose.model('PromoCode', promoCodeSchema);
