import express from "express";
import CompanyDetail from "../../model/admin/CompanyDetailsModel.js";

const router = express.Router();

// Create a new company detail
router.post("/companydetails/create", async (req, res) => {
  try {
    const { companyName, gstNo, mobileNo, email, address } = req.body;
    if (!companyName || !gstNo || !mobileNo || !email || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newCompany = new CompanyDetail({
      companyName,
      gstNo,
      mobileNo,
      email,
      address,
      status: 1,
    });
    await newCompany.save();
    res.status(201).json({ message: "Company detail created successfully", data: newCompany });
  } catch (error) {
    res.status(500).json({ message: "Error creating company detail", error: error.message });
  }
});

// Get all active company details
router.get("/companydetails/all", async (req, res) => {
  try {
    const companies = await CompanyDetail.find({ status: 1 });
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company details", error: error.message });
  }
});

// Get a company detail by ID
router.get("/companydetails/:id", async (req, res) => {
  try {
    const company = await CompanyDetail.findById(req.params.id);
    if (!company) return res.status(404).json({ message: "Company detail not found" });
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ message: "Error fetching company detail", error: error.message });
  }
});

// Update a company detail by ID
router.put("/companydetails/update/:id", async (req, res) => {
  try {
    const { companyName, gstNo, mobileNo, email, address } = req.body;
    if (!companyName || !gstNo || !mobileNo || !email || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const updatedCompany = await CompanyDetail.findByIdAndUpdate(
      req.params.id,
      { companyName, gstNo, mobileNo, email, address },
      { new: true }
    );
    if (!updatedCompany) return res.status(404).json({ message: "Company detail not found" });
    res.status(200).json({ message: "Company detail updated successfully", data: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Error updating company detail", error: error.message });
  }
});

// Soft delete a company detail (set status to 0)
router.put("/companydetails/delete/:id", async (req, res) => {
  try {
    const updatedCompany = await CompanyDetail.findByIdAndUpdate(
      req.params.id,
      { status: 0 },
      { new: true }
    );
    if (!updatedCompany) return res.status(404).json({ message: "Company detail not found" });
    res.status(200).json({ message: "Company detail deleted successfully", data: updatedCompany });
  } catch (error) {
    res.status(500).json({ message: "Error deleting company detail", error: error.message });
  }
});

export default router;
