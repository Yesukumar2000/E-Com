import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema(
  {
    contactEmail: { type: String, required: true },
    contactNumber: { type: String, required: true },
    facebookLink: { type: String, default: "" },
    instagramLink: { type: String, default: "" },
    googlePlusLink: { type: String, default: "" },
    twitterLink: { type: String, default: "" },
    youtubeLink: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("ContactUs", contactUsSchema);
