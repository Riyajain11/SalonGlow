import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema({
  name: String,
  phone: String,
  age: Number,
  gender: String,
  otp: String,
  appointments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Appointment" }]
});

export default mongoose.model("Customer", CustomerSchema);
