import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Reference to Customer model
        required: true
    },
    houseNo: { type: String, required: true },
    apartmentNo: { type: String },
    landmark: { type: String },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    type: { type: String,  required: true },
    status: { type: Number, default: 1 } 
}, { timestamps: true });

const Address = mongoose.model('Address', AddressSchema);

export default Address;
