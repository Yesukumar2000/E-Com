import express from "express";
import ContactUs from "../../model/admin/ContactUsModel.js";

const router = express.Router();

// Create Contact Us Info (Only one record allowed)
router.post("/contact/create", async (req, res) => {
  try {
    const existingContact = await ContactUs.findOne();
    if (existingContact) {
      return res.status(400).json({ message: "Contact Us info already exists. Please update it." });
    }

    const contact = new ContactUs(req.body);
    await contact.save();
    res.status(201).json({ message: "Contact Us info created successfully", contact });
  } catch (error) {
    res.status(500).json({ message: "Error creating contact info", error: error.message });
  }
});

// Get Contact Us Info
router.get("/contact/all", async (req, res) => {
  try {
    const contact = await ContactUs.findOne();
    if (!contact) return res.status(404).json({ message: "No Contact Us info found" });
    res.status(200).json(contact);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact info", error: error.message });
  }
});

// Update Contact Us Info
router.put("/contact/update/:id", async (req, res) => {
  try {
    const updatedContact = await ContactUs.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContact) return res.status(404).json({ message: "Contact Us info not found" });
    res.status(200).json({ message: "Contact Us info updated successfully", contact: updatedContact });
  } catch (error) {
    res.status(500).json({ message: "Error updating contact info", error: error.message });
  }
});

export default router;
