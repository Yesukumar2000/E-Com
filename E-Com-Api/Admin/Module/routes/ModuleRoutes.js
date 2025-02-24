import express from 'express';
import Module from '../models/ModuleModel.js';

const router = express.Router();

// ✅ Create Module
router.post('/create', async (req, res) => {
    try {
        const { moduleName, permission } = req.body;

        const newModule = new Module({ moduleName, permission });
        await newModule.save();

        res.status(201).json({ message: 'Module created successfully', module: newModule });
    } catch (error) {
        res.status(500).json({ message: 'Error creating module', error: error.message });
    }
});

// ✅ Get All Modules (Only Active Modules)
router.get('/all', async (req, res) => {
    try {
        const modules = await Module.find({ status: 1 }); // Fetch only active modules
        res.status(200).json(modules);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching modules', error: error.message });
    }
});

// ✅ Get Module by ID
router.get('/:id', async (req, res) => {
    try {
        const module = await Module.findById(req.params.id);
        if (!module) return res.status(404).json({ message: 'Module not found' });

        res.status(200).json(module);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching module', error: error.message });
    }
});

// ✅ Update Module
router.put('/update/:id', async (req, res) => {
    try {
        const { moduleName, permission } = req.body;

        const updatedModule = await Module.findByIdAndUpdate(
            req.params.id,
            { moduleName, permission },
            { new: true }
        );

        if (!updatedModule) return res.status(404).json({ message: 'Module not found' });

        res.status(200).json({ message: 'Module updated successfully', module: updatedModule });
    } catch (error) {
        res.status(500).json({ message: 'Error updating module', error: error.message });
    }
});

// ✅ Soft Delete (Set status to 0 instead of deleting)
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedModule = await Module.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Set status to Inactive (0)
            { new: true }
        );

        if (!updatedModule) return res.status(404).json({ message: 'Module not found' });

        res.status(200).json({ message: 'Module status changed to inactive', module: updatedModule });
    } catch (error) {
        res.status(500).json({ message: 'Error changing module status', error: error.message });
    }
});

export default router;
