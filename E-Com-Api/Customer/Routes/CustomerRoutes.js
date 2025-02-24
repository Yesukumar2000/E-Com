import express from 'express';
import Customer from '../model/CustomerModel.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// ✅ Create Customer
router.post('/create', async (req, res) => {
    try {
        const { email, mobileNo, name, lastName, password, user_type, profilePic } = req.body;

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

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
        res.status(500).json({ message: 'Error creating customer', error: error.message });
    }
});

// ✅ Get All Active Customers
router.get('/all', async (req, res) => {
    try {
        const customers = await Customer.find({ status: 1 }).select('-password'); // Hide password
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customers', error: error.message });
    }
});

// ✅ Get Customer by ID
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id).select('-password'); // Hide password
        if (!customer) return res.status(404).json({ message: 'Customer not found' });

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching customer', error: error.message });
    }
});

// ✅ Update Customer
router.put('/update/:id', async (req, res) => {
    try {
        const { name, lastName, profilePic } = req.body;

        const updatedCustomer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, lastName, profilePic },
            { new: true }
        );

        if (!updatedCustomer) return res.status(404).json({ message: 'Customer not found' });

        res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (error) {
        res.status(500).json({ message: 'Error updating customer', error: error.message });
    }
});

// ✅ Soft Delete Customer (Change Status to 0)
router.put('/delete/:id', async (req, res) => {
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
