import express from 'express';
import Category from '../models/CategoryModel.js';

const router = express.Router();

// ✅ Create a new Category
router.post('/create', async (req, res) => {
    try {
        const { categoryId, categoryImage, status, area } = req.body;

        const newCategory = new Category({ categoryId, categoryImage, status, area });
        await newCategory.save();

        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error creating category', error: error.message });
    }
});

// ✅ Get all Categories
router.get('/all', async (req, res) => {
    try {
        const categories = await Category.find({ status: 1 }); // Fetch only active categories
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
});

// ✅ Get Category by ID
router.get('/:id', async (req, res) => {
    try {
        const category = await Category.findById(req.params.id).populate('areaId');
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category', error: error.message });
    }
});

// ✅ Update Category by ID
router.put('/:id', async (req, res) => {
    try {
        const { categoryImage, status, areaId } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { categoryImage, status, areaId },
            { new: true }
        );

        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
});

// ✅ Delete Category by ID
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Set status to Inactive (0)
            { new: true }
        );

        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category status changed to inactive', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error changing category status', error: error.message });
    }
});


export default router;
