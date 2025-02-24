import mongoose from 'mongoose';

const costBaseSchema = new mongoose.Schema({
    businessTypeId: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessType', required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    status: { type: Number, default: 1 } // 1 = Active, 0 = Inactive
}, { timestamps: true });

export default mongoose.model('CostBase', costBaseSchema);
