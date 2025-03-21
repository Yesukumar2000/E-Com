import express from "express";
import ProductType from "../model/ProductTypeModel.js";

const router = express.Router();

// ✅ Create Product Type
router.post("/product-type/create", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Product Type name is required" });
    }

    const existingType = await ProductType.findOne({ name });
    if (existingType) {
      return res.status(400).json({ message: "Product Type already exists" });
    }

    const productType = new ProductType({ name });
    await productType.save();

    res.status(201).json({ message: "Product Type created successfully", productType });
  } catch (error) {
    res.status(500).json({ message: "Error creating product type", error: error.message });
  }
});

// ✅ Get All Product Types
router.get("/product-types/all", async (req, res) => {
  try {
    const productTypes = await ProductType.find();
    res.status(200).json(productTypes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product types", error: error.message });
  }
});

// ✅ Get a Single Product Type
router.get("/product-type/:id", async (req, res) => {
  try {
    const productType = await ProductType.findById(req.params.id);
    if (!productType) {
      return res.status(404).json({ message: "Product Type not found" });
    }
    res.status(200).json(productType);
  } catch (error) {
    res.status(500).json({ message: "Error fetching product type", error: error.message });
  }
});

// ✅ Update Product Type
router.put("/product-type/update/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updatedProductType = await ProductType.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedProductType) {
      return res.status(404).json({ message: "Product Type not found" });
    }

    res.status(200).json({ message: "Product Type updated successfully", productType: updatedProductType });
  } catch (error) {
    res.status(500).json({ message: "Already Exist or Try Again", error: error.message });
  }
});

// ✅ Delete Product Type
// router.delete("/product-type/delete/:id", async (req, res) => {
//   try {
//     const deletedProductType = await ProductType.findByIdAndDelete(req.params.id);
//     if (!deletedProductType) {
//       return res.status(404).json({ message: "Product Type not found" });
//     }

//     res.status(200).json({ message: "Product Type deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting product type", error: error.message });
//   }
// });

export default router;
