import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
  roleId: { type: String, unique: true },       // Auto-generated unique role ID
  name: { type: String, required: true },         // Role name
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
  status: { type: Number, default: 1 }             // 1 = Active, 0 = Inactive (Soft Delete)
}, { timestamps: true });

export default mongoose.model('Role', roleSchema);
