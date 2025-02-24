import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
  subCategoryId: { type: String, required: true, unique: true },
  subCategoryName: { type: String, required: true },
  subCategoryImage: { type: String, required: true },
  status: { type: Number, enum: [0, 1], default: 1 }, // 0 = Inactive, 1 = Active
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
});

export default mongoose.model('SubCategory', subCategorySchema);
