import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
  permissionId: { type: String, unique: true }, // Auto-generated unique permission ID
  tab: { type: String, required: true },         // The tab (or section) this permission applies to
  actions:
  { type: String, required: true }, // The actions allowed for this permission (create,  update, delete)
  status: { type: Number, default: 1 }            // 1 = Active, 0 = Inactive (Soft Delete)
}, { timestamps: true });

export default mongoose.model('Permission', permissionSchema);
