import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
    areaId: { type: String, required: true, unique: true }, // Area ID
    areaName: { type: String, required: true }, // Area Name
    status: { type: Number, enum: [0, 1], default: 1 } // 0 - Inactive, 1 - Active
}, { timestamps: true });

export default mongoose.model('Area', areaSchema);
