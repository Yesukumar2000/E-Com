import mongoose from "mongoose";

const CostSchema = new mongoose.Schema(
  {
    costPerGram: { type: Number, required: true, default: 0 },
    productType: { type: mongoose.Schema.Types.ObjectId, ref: "ProductType", required: true }, 
    status: { type: Number, default: 1 }
  },
  { timestamps: true }
);

export default mongoose.model("Cost", CostSchema);
