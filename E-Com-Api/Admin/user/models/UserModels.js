import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    userId: { type: String, required: false, unique: false },
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile_no: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    user_type: { type: String, required: true }, // e.g., Admin, Customer
    dob: { type: Date, required: true },
    image: { type: String }, // URL for profile picture
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserRole', required: false },
    status: { type: Number, default: 1 } // 1 = Active, 0 = Inactive (Soft Delete)
}, { timestamps: true });

// 🔒 Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model('User', UserSchema);

export default User;
