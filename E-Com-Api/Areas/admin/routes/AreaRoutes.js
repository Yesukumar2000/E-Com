import express from 'express';
import Area from '../models/AreaModel.js';
import Category from '../../../Categories/models/admin/CategoryModel.js' // Import the Category model

const router = express.Router();

// ✅ Create a new area
router.post('/area/create', async (req, res) => {
    try {
        // console.log("Received data:", req.body); // Debugging
        const { areaName, categories } = req.body;
        // Validate that all categories exist
        for (const categoryId of categories) {
            // console.log("Checking category ID:", categoryId); // Debugging
            const existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
                // console.log("Category not found:", categoryId); //debugging
                return res.status(400).json({ message: "Category not found" });
            }
        }
        const areaId = `AREA-${Date.now()}`;

        const newArea = new Area({
            areaId,
            areaName,
            category: categories, // Use the array of categories
        });
        // console.log("New area to save:", newArea); // Debugging
        await newArea.save();
        res.status(201).json({ message: "Area created successfully", area: newArea });
    } catch (error) {
        // console.error("Error in /area/create:", error); // Debugging
        res.status(500).json({ message: "Error creating area", error: error.message });
    }
});

// ✅ Get all areas
router.get('/area/all', async (req, res) => {
    try {
        const areas = await Area.find({ status: 1 }).populate('category');
        res.status(200).json(areas);
    } catch (error) {
        res.status(500).json({ message: "Error fetching areas", error: error.message });
    }
});

// ✅ Get area by ID
router.get('/area/:id', async (req, res) => {
    try {
        const area = await Area.findById(req.params.id).populate('category');
        if (!area) {
            return res.status(404).json({ message: "Area not found" });
        }
        res.status(200).json(area);
    } catch (error) {
        res.status(500).json({ message: "Error fetching area", error: error.message });
    }
});

// ✅ Update an area
router.put('/area/update/:id', async (req, res) => {
    try {
        const { areaName, categories } = req.body;

        // Validate that all categories exist
        for (const categoryId of categories) {
            const existingCategory = await Category.findById(categoryId);
            if (!existingCategory) {
                return res.status(400).json({ message: "Category not found" });
            }
        }

        const updatedArea = await Area.findByIdAndUpdate(
            req.params.id,
            { areaName, category: categories }, // Use the array of categories
            { new: true }
        );

        if (!updatedArea) {
            return res.status(404).json({ message: "Area not found" });
        }

        res.status(200).json({ message: "Area updated successfully", area: updatedArea });
    } catch (error) {
        res.status(500).json({ message: "Error updating area", error: error.message });
    }
});

// ✅ Delete an area (set status to 0)
router.put('/area/delete/:id', async (req, res) => {
    try {
        const updatedArea = await Area.findByIdAndUpdate(
            req.params.id,
            { status: 0 },
            { new: true }
        );

        if (!updatedArea) return res.status(404).json({ message: 'Area not found' });

        res.status(200).json({ message: 'Area status changed to inactive', area: updatedArea });
    } catch (error) {
        res.status(500).json({ message: 'Error changing area status', error: error.message });
    }
});

export default router;