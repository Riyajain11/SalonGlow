import mongoose from "mongoose";

const StylistSchema = new mongoose.Schema({
  name: String,
  category: String,
  subCategory: String,
  rating: Number,
  experience: String,
  gallery: [String]
});

const Stylist = mongoose.model("Stylist", StylistSchema);

export default Stylist; 
