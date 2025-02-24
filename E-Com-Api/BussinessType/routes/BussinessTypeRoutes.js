import express from 'express';
import BussinessType from '../models/BussinessTypeModel.js';

const router = express.Router();

// ✅ Create a BussinessType
router.post('/create', async (req, res) => {
    try {
        const { BussinessTypeId, BussinessType: BussinessTypeName, status } = req.body;

        const newBussinessType = new BussinessType({
            BussinessTypeId,
            BussinessType: BussinessTypeName, // ✅ FIXED: Avoid conflict with model name
            status
        });

        await newBussinessType.save();
        res.status(201).json({ message: 'BussinessType created successfully', BussinessType: newBussinessType });
    } catch (error) {
        res.status(500).json({ message: 'Error creating BussinessType', error: error.message });
    }
});
// ✅ Get all BussinessTypes
router.get('/all', async (req, res) => {
    try {
        const BussinessTypes = await BussinessType.find();
        res.status(200).json(BussinessTypes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching BussinessTypes', error: error.message });
    }
});

// ✅ Get BussinessType by ID
router.get('/:id', async (req, res) => {
    try {
        const BussinessType = await BussinessType.findById(req.params.id);
        if (!BussinessType) return res.status(404).json({ message: 'BussinessType not found' });
        res.status(200).json(BussinessType);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching BussinessType', error: error.message });
    }
});

// ✅ Update BussinessType by ID
router.put('/:id', async (req, res) => {
    try {
        const { BussinessType, status } = req.body;
        const updatedBussinessType = await BussinessType.findByIdAndUpdate(
            req.params.id,
            { BussinessType, status },
            { new: true }
        );

        if (!updatedBussinessType) return res.status(404).json({ message: 'BussinessType not found' });

        res.status(200).json({ message: 'BussinessType updated successfully', BussinessType: updatedBussinessType });
    } catch (error) {
        res.status(500).json({ message: 'Error updating BussinessType', error: error.message });
    }
});

// ✅ Delete BussinessType by ID
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedBussinessType = await BussinessType.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Set status to Inactive (0)
            { new: true }
        );

        if (!updatedBussinessType) return res.status(404).json({ message: 'BussinessType not found' });

        res.status(200).json({ message: 'BussinessType status changed to inactive', BussinessType: updatedBussinessType });
    } catch (error) {
        res.status(500).json({ message: 'Error changing BussinessType status', error: error.message });
    }
});


export default router;
