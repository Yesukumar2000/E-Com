import express from 'express';
import About from "../../model/admin/AboutModel.js";
import upload from "../../../../config/multerConfig.js";


const router = express.Router();

// Create About content
router.post('/about/create', upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    const image = req.file ? req.file.path : "";
    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }
    const newAbout = new About({ content, image });
    await newAbout.save();
    res.status(201).json({ message: "About created successfully", about: newAbout });
  } catch (error) {
    res.status(500).json({ message: "Error creating about", error: error.message });
  }
});

// Get About content (assuming only one About document exists)
router.get('/about/all', async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) return res.status(404).json({ message: "About not found" });
    res.status(200).json(about);
  } catch (error) {
    res.status(500).json({ message: "Error fetching about", error: error.message });
  }
});

// Update About content by ID
router.put('/about/update/:id', upload.single("image"), async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }
    let updateData = { content };
    if (req.file) {
      updateData.image = req.file.path;
    }
    const updatedAbout = await About.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedAbout) return res.status(404).json({ message: "About not found" });
    res.status(200).json({ message: "About updated successfully", about: updatedAbout });
  } catch (error) {
    res.status(500).json({ message: "Error updating about", error: error.message });
  }
});

export default router;
