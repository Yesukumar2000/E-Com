import mongoose from 'mongoose';

const UserRoleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    userRole: { type: String, required: true },
    status: { type: Number, default: 1 } 
}, { timestamps: true });

const UserRole = mongoose.model('UserRole', UserRoleSchema);

export default UserRole;
