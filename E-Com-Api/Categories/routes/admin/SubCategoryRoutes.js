import express from 'express';
import SubCategory from '../../models/admin/SubCategoryModel.js'
import Category from '../../models/admin/CategoryModel.js'
import upload from "../../../config/multerConfig.js";

const router = express.Router();
// ✅ Create a new subcategory
router.post('/subcategory/create', upload.single("subCategoryImage"), async (req, res) => {
    // console.log("req.body", req.body);
    try {
        // Destructure using 'name' instead of subCategoryName
        const { name, status, category } = req.body;

        // Check if category exists
        const existingCategory = await Category.findById(category);
        if (!existingCategory) {
            return res.status(400).json({ message: "Category not found" });
        }

        // Generate a unique subCategoryId
        const subCategoryId = `SUB-CAT-${Date.now()}`;

        // Get the image path if file was uploaded
        const subCategoryImage = req.file ? req.file.path : "";

        // Create a new subcategory using 'name'
        const newSubCategory = new SubCategory({
            subCategoryId,
            name,
            subCategoryImage,
            status,
            category
        });

        await newSubCategory.save();
        // console.log("SubCategory Created:", newSubCategory);
        res.status(201).json({ message: "SubCategory created successfully", subCategory: newSubCategory });
    } catch (error) {
        res.status(500).json({ message: "Error creating subcategory", error: error.message });
    }
});


// ✅ Get all subcategories
router.get('/subcategories/all', async (req, res) => {
    try {
        const subCategories = await SubCategory.find({ status: 1 }).populate('category');
        res.status(200).json(subCategories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategories", error: error.message });
    }
});

// ✅ Get subcategory by ID
router.get('/subcategory/:id', async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id).populate('category');
        if (!subCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }
        res.status(200).json(subCategory);
    } catch (error) {
        res.status(500).json({ message: "Error fetching subcategory", error: error.message });
    }
});

// ✅ Update a subcategory
// ✅ Update a subcategory
router.put('/subcategory/update/:id', upload.single("subCategoryImage"), async (req, res) => {
    try {
        const { name, status, category } = req.body;
        let subCategoryImage;

        // Check if a new image was uploaded
        if (req.file) {
            subCategoryImage = req.file.path; // Use the path of the newly uploaded file
        } else {
            // If no new image, get the existing image path
            const existingSubCategory = await SubCategory.findById(req.params.id);
            subCategoryImage = existingSubCategory.subCategoryImage;
        }

        // Check if category exists
        if (category) {
            const existingCategory = await Category.findById(category);
            if (!existingCategory) {
                return res.status(400).json({ message: "Category not found" });
            }
        }

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            req.params.id,
            { name, subCategoryImage, status, category },
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
router.put('/subcategory/delete/:id', async (req, res) => {
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
