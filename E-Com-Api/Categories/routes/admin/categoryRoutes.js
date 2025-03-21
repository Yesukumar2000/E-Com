import express from 'express';
import Category from '../../models/admin/CategoryModel.js';
import upload from "../../../config/multerConfig.js";

const router = express.Router();


// ✅ Create a new Category (with image upload)
router.post("/category/create", upload.single("categoryImage"), async (req, res) => {
    try {
      const { name, status } = req.body;
      // Generate a unique categoryId
      const categoryId = `CAT-${Date.now()}`;
      const categoryImage = req.file ? req.file.path : "";
      // Create a new category
      const newCategory = new Category({ categoryId, name, categoryImage, status });
      await newCategory.save();
      res.status(201).json({ message: "Category created successfully", category: newCategory });
    } catch (error) {
      res.status(500).json({ message: "Error creating category", error: error.message });
    }
  });


// ✅ Get all Categories (active ones)
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Category.find({ status: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
});

// ✅ Get Category by ID
router.get('/category/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('areaId');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
});

// ✅ Update Category by ID (with optional image upload)
router.put('/category/update/:id', upload.single('categoryImage'), async (req, res) => {
    try {
        const { name } = req.body;  
        let updateData = { name};

        if (req.file) {
          updateData.categoryImage = req.file.path;
        }

        const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

        res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category', error: error.message });
    }
});


// ✅ "Delete" Category by ID (mark as inactive)
router.put('/category/delete/:id', async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { status: 0 },
      { new: true }
    );
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });

    res.status(200).json({ message: 'Category status changed to inactive', category: updatedCategory });
  } catch (error) {
    res.status(500).json({ message: 'Error changing category status', error: error.message });
  }
});

export default router;
