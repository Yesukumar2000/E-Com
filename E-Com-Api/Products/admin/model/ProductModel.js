import mongoose from 'mongoose';
import Cost from './CostModel.js';

const productSchema = new mongoose.Schema({
  whichProduct: { type: String, required: true }, // weight based product or fixed price product , ..
  product_type: { type: mongoose.Schema.Types.ObjectId, ref: 'Cost', required: false },// gold, silver, diamond, etc.
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },// e.g. ring, chain, etc.
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: true },// e.g. gold ring, gold chain, etc.
  name: { type: String, required: true },// e.g. 22k gold ring, 18k gold chain, etc.
  description: { type: String, required: true },// e.g. 22k gold ring with diamond, 18k gold chain with pendant, etc.
  specification: { type: String },// e.g. 22k gold ring with 0.5 carat diamond, 18k gold chain with 1 carat pendant, etc.
  images: [{ type: String, required: true }],// e.g. image1.jpg, image2.jpg, etc.
  size: { type: String },// e.g. 6, 7, 8, etc.
  weight: { type: Number, required: false },// e.g. 5 grams, 10 grams, etc.
  price: { type: Number, required: false }, // price is calculated based on weight and costPerGram
  stock: { type: Number, required: true }, // e.g. 10, 20, 30, etc.
  status: { type: Number, default: 1 }
}, { timestamps: true });


export default mongoose.model('Product', productSchema);