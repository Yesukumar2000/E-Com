import mongoose from "mongoose";

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("ProductType", productTypeSchema);
