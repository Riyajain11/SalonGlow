import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  stylistId: { type: mongoose.Schema.Types.ObjectId, ref: "Stylist", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  review: { type: String, default: "" },
  rating: { type: Number, default: 0 }, // 1-5
  status: { type: String, enum: ["SC", "CP", "CA"], default: "SC" } // SC = Scheduled, CP = Completed, CA = Cancelled
});

export default mongoose.model("Appointment", AppointmentSchema);
