import express from 'express';
import Address from '../models/AddressModel.js';

const router = express.Router();

// ✅ Create Address (Linked to Customer)
router.post('/create', async (req, res) => {
    try {
        const { customerId, houseNo, apartmentNo, landmark, country, state, city, pincode, type } = req.body;

        const newAddress = new Address({ 
            customerId, 
            houseNo, 
            apartmentNo, 
            landmark, 
            country, 
            state, 
            city, 
            pincode, 
            type 
        });

        await newAddress.save();
        res.status(201).json({ message: 'Address created successfully', address: newAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error creating address', error: error.message });
    }
});

// ✅ Get Addresses by Customer ID
router.get('/:customerId', async (req, res) => {
    try {
        const addresses = await Address.find({ customerId: req.params.customerId, status: 1 });
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching addresses', error: error.message });
    }
});

// ✅ Get Address by ID
router.get('/:id', async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        res.status(200).json(address);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching address', error: error.message });
    }
});

// ✅ Update Address by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });

        res.status(200).json({ message: 'Address updated successfully', address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error updating address', error: error.message });
    }
});

// ✅ Soft Delete Address by ID (Set status to 0)
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            req.params.id,
            { status: 0 },
            { new: true }
        );

        if (!updatedAddress) return res.status(404).json({ message: 'Address not found' });

        res.status(200).json({ message: 'Address soft deleted (inactive)', address: updatedAddress });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting address', error: error.message });
    }
});

export default router;
