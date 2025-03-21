import mongoose from "mongoose";

const GeneralsSchema = new mongoose.Schema({
  siteName: { type: String, default: "" },
  footerCopyright: { type: String, default: "" },
  currencySymbol: { type: String, default: "" },
  // If you want multiple logos, you can store them in an array:
  siteLogo: { type: String, default: "" },  
  footerLogo: { type: String, default: "" },  
  // You can add more fields for "Company Details", "Meta Content", etc. in the same schema
  status: { type: Number, default: 1 }, // 1 = active, 0 = inactive (if needed)
}, { timestamps: true });

export default mongoose.model("General", GeneralsSchema);
