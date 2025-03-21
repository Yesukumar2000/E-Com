import express from "express";
import multer from "multer";
import General from "../../model/admin/GeneralModel.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// GET single doc
router.get("/general", async (req, res) => {
  try {
    let doc = await General.findOne({ status: 1 });
    res.status(200).json(doc || null);
  } catch (error) {
    res.status(500).json({ message: "Error fetching general settings", error: error.message });
  }
});

// CREATE
router.post("/general/create", upload.fields([
  { name: "siteLogo", maxCount: 1 },
  { name: "footerLogo", maxCount: 1 },
]), async (req, res) => {
  try {
    const { siteName, footerCopyright, currencySymbol } = req.body;
    const newDoc = new General({
      siteName,
      footerCopyright,
      currencySymbol,
    });
    if (req.files.siteLogo) {
      newDoc.siteLogo = req.files.siteLogo[0].path;
    }
    if (req.files.footerLogo) {
      newDoc.footerLogo = req.files.footerLogo[0].path;
    }
    await newDoc.save();
    res.status(201).json({ message: "General settings created", data: newDoc });
  } catch (error) {
    res.status(500).json({ message: "Error creating general settings", error: error.message });
  }
});

// UPDATE
router.put("/general/update", upload.fields([
  { name: "siteLogo", maxCount: 1 },
  { name: "footerLogo", maxCount: 1 },
]), async (req, res) => {
  try {
    const { id, siteName, footerCopyright, currencySymbol } = req.body;
    let doc = await General.findById(id);
    if (!doc) {
      return res.status(404).json({ message: "Settings doc not found" });
    }
    doc.siteName = siteName;
    doc.footerCopyright = footerCopyright;
    doc.currencySymbol = currencySymbol;
    if (req.files.siteLogo) {
      doc.siteLogo = req.files.siteLogo[0].path;
    }
    if (req.files.footerLogo) {
      doc.footerLogo = req.files.footerLogo[0].path;
    }
    await doc.save();
    res.status(200).json({ message: "General settings updated", data: doc });
  } catch (error) {
    res.status(500).json({ message: "Error updating general settings", error: error.message });
  }
});

export default router;
