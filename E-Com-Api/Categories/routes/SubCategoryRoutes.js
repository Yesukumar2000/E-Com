import express from 'express';
import SubCategory from '../models/SubCategoryModel.js'
import Category from '../models/CategoryModel.js'

const router = express.Router();
// ✅ Create a new subcategory
router.post('/create', async (req, res) => {
    try {
        const { subCategoryId, subCategoryName, subCategoryImage, status, category } = req.body;

        // Check if category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(400).json({ message: "Category not found" });
        }

        const newSubCategory = new SubCategory({
            subCategoryId,
            subCategoryName,
            subCategoryImage,
            status,
            category
        });

        await newSubCategory.save();
        res.status(201).json({ message: "SubCategory created successfully", subCategory: newSubCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating subcategory", error: error.message });
    }
});

// ✅ Get all subcategories
router.get('/all', async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('category', 'categoryName');
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategories", error: error.message });
    }
});

// ✅ Get subcategory by ID
router.get('/:id', async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id).populate('category', 'categoryName');
        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }
        res.status(200).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategory", error: error.message });
    }
});

// ✅ Update a subcategory
router.put('/update/:id', async (req, res) => {
    try {
        const { subCategoryName, subCategoryImage, status, category } = req.body;

        // Check if category exists
        if (category) {
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(400).json({ message: "Category not found" });
            }
        }

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { subCategoryName, subCategoryImage, status, category },
            { new: true }
        );

        if (!updatedSubCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }

        res.status(200).json({ message: "SubCategory updated successfully", subCategory: updatedSubCategory });
    } catch (error) {
        res.status(500).json({ message: "Error updating subcategory", error: error.message });
    }
});

// ✅ Delete a subcategory
router.put('/delete/:id', async (req, res) => {
    try {
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { status: 0 }, // Set status to Inactive (0)
            { new: true }
        );

        if (!updatedSubCategory) return res.status(404).json({ message: 'SubCategory not found' });

        res.status(200).json({ message: 'SubCategory status changed to inactive', subCategory: updatedSubCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error changing subcategory status', error: error.message });
    }
});


export default router;
