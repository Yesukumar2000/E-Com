import express from 'express';
import Banner from "../../model/admin/BannerModel.js";
import upload from "../../../config/multerConfig.js";

const router = express.Router();

// Check if scrollOrderNo is unique within the given banner_Type
const isScrollOrderUnique = async (banner_Type, scrollOrderNo, excludeId = null) => {
  const query = { banner_Type, scrollOrderNo: Number(scrollOrderNo), status: 1 };

  if (excludeId) {
    query._id = { $ne: excludeId }; // Exclude current banner if updating
  }

  const existing = await Banner.findOne(query);
  return !existing; // Return true if scrollOrderNo is unique within the same banner_Type
};

// Create a new Banner
router.post('/banner/create', upload.single("image"), async (req, res) => {
  try {
    const { banner_Type, name, scrollOrderNo } = req.body;
    if (!banner_Type || !name || !scrollOrderNo) {
      return res.status(400).json({ message: 'Banner type, name, and scroll order number are required' });
    }

    // Ensure scrollOrderNo is unique within the same banner_Type
    const unique = await isScrollOrderUnique(banner_Type, scrollOrderNo);
    if (!unique) {
      return res.status(400).json({ message: `Scroll order number ${scrollOrderNo} already exists in ${banner_Type}. Choose another number.` });
    }

    const image = req.file ? req.file.path : "";
    
    const newBanner = new Banner({
      banner_Type,
      name,
      image,
      scrollOrderNo: Number(scrollOrderNo),
      status: 1,
    });

    await newBanner.save();
    res.status(201).json({ message: 'Banner created successfully', banner: newBanner });
  } catch (error) {
    res.status(500).json({ message: 'Error creating banner', error: error.message });
  }
});

// Update a banner by ID
router.put('/banner/update/:id', upload.single("image"), async (req, res) => {
  try {
    const { banner_Type, name, scrollOrderNo } = req.body;
    if (!banner_Type || !name || !scrollOrderNo) {
      return res.status(400).json({ message: 'Banner type, name, and scroll order number are required' });
    }

    // Ensure scrollOrderNo remains unique within banner_Type (excluding current banner)
    const unique = await isScrollOrderUnique(banner_Type, scrollOrderNo, req.params.id);
    if (!unique) {
      return res.status(400).json({ message: `Scroll order number ${scrollOrderNo} already exists in ${banner_Type}. Choose another number.` });
    }

    let updateData = { banner_Type, name, scrollOrderNo: Number(scrollOrderNo) };
    if (req.file) {
      updateData.image = req.file.path;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedBanner) return res.status(404).json({ message: 'Banner not found' });

    res.status(200).json({ message: 'Banner updated successfully', banner: updatedBanner });
  } catch (error) {
    res.status(500).json({ message: 'Error updating banner', error: error.message });
  }
});

// Get all active banners
router.get('/banners/all', async (req, res) => {
  try {
    const banners = await Banner.find({ status: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching banners', error: error.message });
  }
});

// Soft delete a banner (set status to 0)
router.put('/banner/delete/:id', async (req, res) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
    if (!updatedBanner) return res.status(404).json({ message: 'Banner not found' });

    res.status(200).json({ message: 'Banner deleted successfully', banner: updatedBanner });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting banner', error: error.message });
  }
});

export default router;
