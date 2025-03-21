import mongoose from "mongoose";

const companyDetailsSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  gstNo: { type: String, required: true },
  mobileNo: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  status: { type: Number, default: 1 } // 1 = active, 0 = inactive (soft delete)
}, { timestamps: true });

export default mongoose.model("CompanyDetail", companyDetailsSchema);
