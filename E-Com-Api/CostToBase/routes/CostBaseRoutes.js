import express from 'express';
import CostBase from  '../models/CostBaseModel.js';

const router = express.Router();

// ✅ Create Cost Base Entry
router.post('/create', async (req, res) => {
    try {
        const { businessTypeId, categoryId, name, cost } = req.body;

        const newCost = new CostBase({ businessTypeId, categoryId, name, cost });
        await newCost.save();

        res.status(201).json({ message: 'Cost To Base entry created successfully', costBase: newCost });
    } catch (error) {
        res.status(500).json({ message: 'Error creating Cost To Base entry', error: error.message });
    }
});

// ✅ Get All Active Cost Base Entries
router.get('/all', async (req, res) => {
    try {
        const costs = await CostBase.find({ status: 1 }).populate('categoryId', 'name');
        res.status(200).json(costs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cost base entries', error: error.message });
    }
});

// ✅ Get Cost Base Entry by ID
router.get('/:id', async (req, res) => {
    try {
        const cost = await CostBase.findById(req.params.id).populate('businessTypeId categoryId', 'name');
        if (!cost) return res.status(404).json({ message: 'Cost base entry not found' });

        res.status(200).json(cost);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching cost base entry', error: error.message });
    }
});

// ✅ Update Cost Base Entry
router.put('/update/:id', async (req, res) => {
    try {
        const { businessTypeId, categoryId, name, cost, status } = req.body;

        const updatedCost = await CostBase.findByIdAndUpdate(
            req.params.id,
            { businessTypeId, categoryId, name, cost, status },
            { new: true }
        );

        if (!updatedCost) return res.status(404).json({ message: 'Cost base entry not found' });

        res.status(200).json({ message: 'Cost base entry updated successfully', costBase: updatedCost });
    } catch (error) {
        res.status(500).json({ message: 'Error updating cost base entry', error: error.message });
    }
});

// ✅ Soft Delete (Change Status to Inactive)
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedCost = await CostBase.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Change status to Inactive (0)
            { new: true }
        );

        if (!updatedCost) return res.status(404).json({ message: 'Cost base entry not found' });

        res.status(200).json({ message: 'Cost base entry marked as inactive', costBase: updatedCost });
    } catch (error) {
        res.status(500).json({ message: 'Error changing cost base status', error: error.message });
    }
});

export default router;
