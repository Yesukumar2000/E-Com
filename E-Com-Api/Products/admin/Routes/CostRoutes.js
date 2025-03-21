import express from "express";
import Cost from "../model/CostModel.js";
import Product from "../model/ProductModel.js"; // Ensure correct path

const router = express.Router();

// ✅ Get Cost
router.get("/costs/all", async (req, res) => {
  try {
    // Only return active cost records (status: 1)
    const costs = await Cost.find({ status: 1 }).populate("productType");
    res.status(200).json(costs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cost data", error: error.message });
  }
});

// Now only checks for active cost records (status: 1)
router.post("/cost/create", async (req, res) => {
  try {
    const { costPerGram, productType } = req.body;
    if (!productType) {
      return res.status(400).json({ message: "Product Type is required" });
    }
    // Only check active cost records
    const existingCost = await Cost.findOne({ productType, status: 1 });
    if (existingCost) {
      return res.status(400).json({ message: "Cost already exists for this product type. Please update instead." });
    }
    const cost = new Cost({ costPerGram, productType });
    await cost.save();
    res.status(201).json(cost);
  } catch (error) {
    res.status(500).json({ message: "Error creating cost data", error: error.message });
  }
});


// ✅ Update Cost
router.put("/cost/update/:id", async (req, res) => {
  try {
    const { costPerGram, productType } = req.body;

    if (!productType) {
      return res.status(400).json({ message: "Product Type is required" });
    }

    // ✅ Check if the productType already exists in another record (excluding the current one)
    const existingCost = await Cost.findOne({ 
      productType, 
      status: 1, 
      _id: { $ne: req.params.id }  // Exclude the current record from the check
    });

    if (existingCost) {
      return res.status(400).json({ message: "Product type is already exist. Please choose a different one." });
    }

    const updatedCost = await Cost.findByIdAndUpdate(
      req.params.id,
      { costPerGram, productType },
      { new: true }
    );

    if (!updatedCost) {
      return res.status(404).json({ message: "Cost data not found" });
    }

    // ✅ Update product prices for this product type
    await Product.updateMany(
      { status: 1, product_type: updatedCost.productType },
      [
        {
          $set: {
            price: { $multiply: ["$weight", updatedCost.costPerGram] }
          }
        }
      ]
    );

    res.json({ message: "Cost updated successfully and product prices recalculated.", cost: updatedCost });

  } catch (error) {
    res.status(500).json({ message: "Error updating cost data", error: error.message });
  }
});



  // ✅ Soft Delete Cost (Set status to 0)
router.put("/cost/delete/:id", async (req, res) => {
  try {
    const updatedCost = await Cost.findByIdAndUpdate(
      req.params.id,
      { status: 0 },
      { new: true }
    );
    if (!updatedCost) {
      return res.status(404).json({ message: "Cost data not found" });
    }
    res.json({ message: "Cost record deleted successfully", cost: updatedCost });
  } catch (error) {
    res.status(500).json({ message: "Error deleting cost data", error: error.message });
  }
});

export default router;