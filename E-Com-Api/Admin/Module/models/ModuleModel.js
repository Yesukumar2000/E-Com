import mongoose from 'mongoose';

const ModuleSchema = new mongoose.Schema({
    moduleName: { type: String, required: true, unique: true },
    permission: { type: String, required: true }, 
    status: { type: Number, default: 1 } 
}, { timestamps: true });

const Module = mongoose.model('Module', ModuleSchema);

export default Module;
