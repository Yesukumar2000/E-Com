import mongoose from "mongoose";

const policySchema = new mongoose.Schema(
  {
    termsAndConditions: { type: String, required: true },
    shippingPolicy: { type: String, required: true },
    privacyPolicy: { type: String, required: true },
    returnPolicy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Policy", policySchema);
