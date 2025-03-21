import express from 'express';
import Customer from '../model/CustomerModel.js';
import bcrypt from 'bcryptjs';
import upload from '../../config/multerConfig.js';

const router = express.Router();

// ✅ Create Customer (with profile picture upload)
router.post('/customer/create', upload.single("profilePic"), async (req, res) => {
    try {
        const { email, mobileNo, name, lastName, password, user_type } = req.body;
         // Check if email already exists
         const existingEmailCustomer = await Customer.findOne({ email });
         if (existingEmailCustomer) {
             return res.status(400).json({ message: 'Email already exists. Please use a different email.' });
         }
 
         // Check if mobileNo already exists
         const existingMobileCustomer = await Customer.findOne({ mobileNo });
         if (existingMobileCustomer) {
             return res.status(400).json({ message: 'Mobile number already exists. Please use a different mobile number.' });
         }
 
        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const profilePic = req.file ? req.file.path : ""; // Get profile 

        const newCustomer = new Customer({
            email,
            mobileNo,
            name,
            lastName,
            password: hashedPassword,
            user_type,
            profilePic
        });

        await newCustomer.save();
        res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (error) {
        res.status(500).json({ message: `Error creating customer: ${error.message}`, error: error.message });
    }
});

// ✅ Get All Active Customers
router.get('/customer/all', async (req, res) => {
    try {
        const customers = await Customer.find({ status: 1 }).select('-password'); // Hide password
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
});

// ✅ Get Customer by ID
router.get('/customer/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select('-password'); // Hide password
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
});

// ✅ Update Customer (with optional profile picture upload)
router.put('/customer/update/:id', upload.single('profilePic'), async (req, res) => {
    try {
        const { name, lastName } = req.body;

        let updateData = { name, lastName };

        if (req.file) {
            updateData.profilePic = req.file.path; // Update profile picture path if a new file is uploaded
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });

        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
});

// ✅ Soft Delete Customer (Change Status to 0)
router.put('/customer/delete/:id', async (req, res) => {
    try {
        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Soft delete
            { new: true }
        );

        if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });

        res.status(200).json({ message: 'Customer status changed to inactive', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error changing customer status', error: error.message });
    }
});

export default router;