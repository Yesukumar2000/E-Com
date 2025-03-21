// import express from "express";
// import Product from "../../admin/model/ProductModel.js";
// import upload from "../../../config/multerConfig.js";
// const router = express.Router();

// // ✅ Create Product with Image Upload (Max 5 images)
// router.post("/product/create", upload.array("images", 5), async (req, res) => {
//     try {
//         const { whichProduct, product_type, category, subcategory, name, description, specification, size, weight, stock } = req.body;

//         if (!req.files || req.files.length === 0) {
//             return res.status(400).json({ message: "At least one image is required" });
//         }

//         if (whichProduct === "weight based product" && !product_type) {
//             return res.status(400).json({ message: "Product type is required for weight-based products." });
//         }

//         const imagePaths = req.files.map(file => file.path);

//         const newProduct = new Product({
//             whichProduct,
//             product_type,
//             category,
//             subcategory,
//             name,
//             description,
//             specification,
//             images: imagePaths,
//             size,
//             weight,
//             stock
//         });

//         await newProduct.save();
//         res.status(201).json({ message: "Product created successfully", product: newProduct });

//     } catch (error) {
//         console.error("Error creating product:", error);
//         res.status(500).json({ message: "Error creating product", error: error.message });
//     }
// });

// // ✅ Update Product with Image Upload (Max 5 images)
// router.put("/product/update/:id", upload.array("images", 5), async (req, res) => {
//     try {
//         const { whichProduct, product_type, category, subcategory, name, description, specification, size, weight, stock } = req.body;

//         if (whichProduct === "weight based product" && !product_type) {
//             return res.status(400).json({ message: "Product type is required for weight-based products." });
//         }

//         const imagePaths = req.files.length > 0 ? req.files.map(file => file.path) : undefined;

//         const updatedProduct = await Product.findByIdAndUpdate(
//             req.params.id,
//             {
//                 whichProduct,
//                 product_type,
//                 category,
//                 subcategory,
//                 name,
//                 description,
//                 specification,
//                 size,
//                 weight,
//                 stock,
//                 ...(imagePaths && { images: imagePaths })
//             },
//             { new: true, runValidators: true } // runValidators: true to trigger pre-validate hooks
//         );

//         if (!updatedProduct) {
//             return res.status(404).json({ message: "Product not found" });
//         }

//         res.json({ message: "Product updated successfully", product: updatedProduct });

//     } catch (error) {
//         console.error("Error updating product:", error);
//         res.status(500).json({ message: "Error updating product", error: error.message });
//     }
// });

// // ✅ Get All Products
// router.get("/product/all", async (req, res) => {
//     try {
//         const products = await Product.find({ status: 1 })
//             .populate("product_type", "costPerGram")
//             .populate("category", "name")
//             .populate("subcategory", "name");
//         res.status(200).json(products);
//     } catch (error) {
//         console.error("Error fetching products:", error);
//         res.status(500).json({ message: "Error fetching products", error: error.message });
//     }
// });

// // ✅ Get Single Product by ID
// router.get("/product/:id", async (req, res) => {
//     try {
//         const product = await Product.findById(req.params.id)
//             .populate("product_type", "costPerGram")
//             .populate("category", "name")
//             .populate("subcategory", "name");
//         if (!product) return res.status(404).json({ message: "Product not found" });
//         res.status(200).json(product);
//     } catch (error) {
//         console.error("Error fetching product:", error);
//         res.status(500).json({ message: "Error fetching product", error: error.message });
//     }
// });

// // ✅ Soft Delete Product (Set status to 0)
// router.put("/product/delete/:id", async (req, res) => {
//     try {
//         const deletedProduct = await Product.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
//         if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
//         res.json({ message: "Product deleted successfully", product: deletedProduct });
//     } catch (error) {
//         console.error("Error deleting product:", error);
//         res.status(500).json({ message: "Error deleting product", error: error.message });
//     }
// });

// export default router;

import express from "express";
import mongoose from "mongoose"; 
import Product from "../../admin/model/ProductModel.js";
import Cost from "../model/CostModel.js";
import upload from "../../../config/multerConfig.js";
import Category from "../../../Categories/models/admin/CategoryModel.js";
import SubCategory from "../../../Categories/models/admin/SubCategoryModel.js";

const router = express.Router();

// Helper function to calculate price for weight-based products
const calculatePrice = async (weight, productType) => {
    const costDoc = await Cost.findOne({ product_type: productType, status: 1 });
    return costDoc && costDoc.costPerGram ? Number(weight) * costDoc.costPerGram : 0;
  };
  
// Create Product
router.post('/product/create', upload.array('images', 5), async (req, res) => {
    try {
      const { whichProduct, product_type, category, subcategory, name, description, specification, size, weight, stock, price } = req.body;
      if (!category || !subcategory || !name || !description || !stock ) {
        return res.status(400).json({ message: 'Required fields missing' });
      }
  
      // Extract image paths
      const images = req.files ? req.files.map(file => file.path) : [];
  
      // Determine price based on product type
      let finalPrice = 0;
      if (whichProduct === "direct") {
        finalPrice = Number(price);
      } else if (whichProduct === "weightBased") {
        finalPrice = await calculatePrice(weight, product_type);
      }
  
      const newProduct = new Product({
        whichProduct,
        product_type,
        category,
        subcategory,
        name,
        description,
        specification,
        images,
        size,
        weight,
        price: finalPrice,
        stock,
        status: 1
      });
  
      await newProduct.save();
      res.status(201).json({ message: "Product created successfully", product: newProduct });
    } catch (error) {
      res.status(500).json({ message: "Error creating product", error: error.message });
    }
  });
  

// Get all active products
router.get('/products/all', async (req, res) => {
    try {
      let products = await Product.find({ status: 1 })
        .populate('category')
        .populate('subcategory')
        .populate('product_type', "name");
  
      // Fetch cost records to use for recalculation
      const costs = await Cost.find({ status: 1 });
  
      // Recalculate price for weight-based products
      products = products.map(product => {
        if (product.whichProduct === "weightBased" && product.weight && product.product_type) {
          const costRecord = costs.find(c => c._id.toString() === product.product_type._id.toString());
          if (costRecord && costRecord.costPerGram) {
            product = product.toObject(); // convert mongoose doc to plain object if needed
            product.price = Number(product.weight) * costRecord.costPerGram;
          }
        }
        return product;
      });
  
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error: error.message });
    }
  });
  

// Get a product by ID 
router.get('/product/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate("productType")
            .populate('category')
            .populate('subcategory');
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error fetching product", error: error.message });
    }
});

// Update Product
// Update Product
router.put('/product/update/:id', upload.array('images', 5), async (req, res) => {
    try {
      const { whichProduct, product_type, category, subcategory, name, description, specification, size, weight, stock, price } = req.body;
      if (!category || !subcategory || !name || !description || !stock) {
        return res.status(400).json({ message: 'Required fields missing' });
      }
  
      let updateData = { 
        whichProduct,
        product_type, 
        category, 
        subcategory, 
        name, 
        description, 
        specification, 
        size, 
        weight, 
        stock
      };
  
      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map(file => file.path);
      }
  
      // Determine price based on product type
      if (whichProduct === "direct") {
        updateData.price = Number(price);
      } else if (whichProduct === "weightBased") {
        updateData.price = await calculatePrice(weight, product_type);
      }
  
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
      if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
  
      res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
      res.status(500).json({ message: "Error updating product", error: error.message });
    }
  });

// Soft delete product (set status to 0)
router.put('/product/delete/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, { status: 0 }, { new: true });
        if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Product deleted successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
});

export default router;

