import express from 'express';
import Area from '../models/AreaModel.js';

const router = express.Router();

// ✅ Create Area
router.post('/create', async (req, res) => {
    try {
        const { areaId, areaName, status } = req.body;

        const newArea = new Area({ areaId, areaName, status });
        await newArea.save();

        res.status(201).json({ message: 'Area created successfully', area: newArea });
        // console.log("Area Created:", newArea);
    } catch (error) {
        res.status(500).json({ message: 'Error creating area', error: error.message });
    }
});

// ✅ Get all Areas
router.get('/all', async (req, res) => {
    try {
        const areas = await Area.find({ status: 1 });
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching areas', error: error.message });
    }
});

// ✅ Get Area by ID
router.get('/:id', async (req, res) => {
    try {
        const area = await Area.findById(req.params.id);
        if (!area) return res.status(404).json({ message: 'Area not found' });

        res.status(200).json(area);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching area', error: error.message });
    }
});

// ✅ Update Area (Including Status)
router.put('/update/:id', async (req, res) => {
    try {
        const { areaName, status } = req.body;

        const updatedArea = await Area.findByIdAndUpdate(
            req.params.id,
            { areaName, status },
            { new: true } // Returns the updated document
        );

        if (!updatedArea) return res.status(404).json({ message: 'Area not found' });

        res.status(200).json({ message: 'Area updated successfully', area: updatedArea });
    } catch (error) {
        res.status(500).json({ message: 'Error updating area', error: error.message });
    }
});

// ✅ Change Status to Inactive Instead of Deleting
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedArea = await Area.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Change status to Inactive (0)
            { new: true }
        );

        if (!updatedArea) return res.status(404).json({ message: 'Area not found' });

        res.status(200).json({ message: 'Area status changed to Inactive (0)', area: updatedArea });
    } catch (error) {
        res.status(500).json({ message: 'Error changing area status', error: error.message });
    }
});

export default router;
