import express from 'express';
import MetaContent from "../../model/admin/MetaContentModel.js";

const router = express.Router();

// Create Meta Content
router.post('/meta/create', async (req, res) => {
  try {
    const { metaTitle, metaDescription } = req.body;
    if (!metaTitle || !metaDescription) {
      return res.status(400).json({ message: 'Meta title and meta description are required' });
    }
    const newMeta = new MetaContent({ metaTitle, metaDescription });
    await newMeta.save();
    res.status(201).json({ message: 'Meta content created successfully', metaContent: newMeta });
  } catch (error) {
    res.status(500).json({ message: 'Error creating meta content', error: error.message });
  }
});

// Get Meta Content
// If you expect only one document, you might use findOne()
router.get('/meta/all', async (req, res) => {
  try {
    const metaContent = await MetaContent.findOne();
    if (!metaContent) return res.status(404).json({ message: 'Meta content not found' });
    res.status(200).json(metaContent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching meta content', error: error.message });
  }
});

// Update Meta Content by ID
router.put('/meta/update/:id', async (req, res) => {
  try {
    const { metaTitle, metaDescription } = req.body;
    if (!metaTitle || !metaDescription) {
      return res.status(400).json({ message: 'Meta title and meta description are required' });
    }
    const updatedMeta = await MetaContent.findByIdAndUpdate(
      req.params.id,
      { metaTitle, metaDescription },
      { new: true }
    );
    if (!updatedMeta) return res.status(404).json({ message: 'Meta content not found' });
    res.status(200).json({ message: 'Meta content updated successfully', metaContent: updatedMeta });
  } catch (error) {
    res.status(500).json({ message: 'Error updating meta content', error: error.message });
  }
});

export default router;
