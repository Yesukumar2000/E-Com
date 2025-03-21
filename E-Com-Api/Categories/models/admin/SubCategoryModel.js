import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema({
    subCategoryId: { type: String, unique: true }, // Unique SubCategory ID
    name: { type: String, required: true }, // SubCategory Name
    subCategoryImage: { type: String }, // Image Path (optional)
    status: { 
        type: Number,  // ✅  Numeric (0 = inactive, 1 = active)
        enum: [0, 1], 
        default: 1 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',  // ✅ Linking SubCategory to Category
        required: true 
    }
}, { timestamps: true });

export default mongoose.model('SubCategory', subCategorySchema);
