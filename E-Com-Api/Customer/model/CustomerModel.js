import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    mobileNo: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    password: { type: String, required: true },
    user_type: { type: String, default: 'user' }, // Default user type
    profilePic: { type: String }, // Profile picture URL
    status: { type: Number, default: 1 } // 1 = Active, 0 = Inactive (Soft Delete)
}, { timestamps: true });

const Customer = mongoose.model('Customer', CustomerSchema);

export default Customer;
