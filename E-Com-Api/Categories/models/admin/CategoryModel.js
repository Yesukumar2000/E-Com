import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    categoryId: { type: String, unique: true }, // Category ID
    name: { type: String, required: true }, // Category Name
    categoryImage: { type: String, required: true }, // Image Path
    status: { 
        type: Number,  // ✅  Numeric (0 = inactive, 1 = active)
        enum: [0, 1], 
        default: 1 
    },
    // area: { 
    //     type: mongoose.Schema.Types.ObjectId, 
    //     ref: 'Area',  // ✅ Linking Category to Area
    //     required: true 
    // }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
