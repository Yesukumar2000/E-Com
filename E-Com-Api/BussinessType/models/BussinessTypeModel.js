import mongoose from 'mongoose';

const BussinessTypeSchema = new mongoose.Schema({
    BussinessTypeId: { type: String, required: true, unique: true },
    BussinessType: { type: String, required: true },
    status: { type: Number, default: 1 } // 1 = Active, 0 = Inactive
}, { timestamps: true });

const BussinessType = mongoose.model('BussinessType', BussinessTypeSchema);

export default BussinessType;
