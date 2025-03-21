import express from "express";
import Policy from "../../model/admin/PolicyModel.js";

const router = express.Router();

// ✅ Create Policy (Only One Entry Allowed)
router.post("/policy/create", async (req, res) => {
  try {
    const { termsAndConditions, shippingPolicy, privacyPolicy, returnPolicy } = req.body;

    const existingPolicy = await Policy.findOne();
    if (existingPolicy) {
      return res.status(400).json({ message: "Policy already exists. Use update API instead." });
    }

    const policy = new Policy({ termsAndConditions, shippingPolicy, privacyPolicy, returnPolicy });
    await policy.save();

    res.status(201).json({ message: "Policy created successfully", policy });
  } catch (error) {
    res.status(500).json({ message: "Error creating policy", error: error.message });
  }
});

// ✅ Get Policy
router.get("/policy/all", async (req, res) => {
  try {
    const policy = await Policy.findOne();
    if (!policy) return res.status(404).json({ message: "Policy not found" });
    res.status(200).json(policy);
  } catch (error) {
    res.status(500).json({ message: "Error fetching policy", error: error.message });
  }
});

// ✅ Update Policy
router.put("/policy/update/:id", async (req, res) => {
  try {
    const { termsAndConditions, shippingPolicy, privacyPolicy, returnPolicy } = req.body;
    const { id } = req.params;

    const policy = await Policy.findByIdAndUpdate(
      id,
      { termsAndConditions, shippingPolicy, privacyPolicy, returnPolicy },
      { new: true }
    );

    if (!policy) return res.status(404).json({ message: "Policy not found" });

    res.status(200).json({ message: "Policy updated successfully", policy });
  } catch (error) {
    res.status(500).json({ message: "Error updating policy", error: error.message });
  }
});

export default router;
