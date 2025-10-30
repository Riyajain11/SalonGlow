import express from "express";
import Appointment from "../models/Appointment.js";
import Customer from "../models/Customer.js";

const router = express.Router();

// Book an appointment
router.post("/book", async (req, res) => {
  const { customerId, stylistId, date, time } = req.body;
  try {
    const appointment = new Appointment({ customerId, stylistId, date, time });
    await appointment.save();
    res.json({ success: true, message: "Appointment booked", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all appointments for a customer
router.get("/:customerId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ customerId: req.params.customerId })
      .populate("stylistId", "name category subCategory rating experience gallery")
      .populate("customerId", "name phone");
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single appointment by ID
router.get("/detail/:id", async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("stylistId")
      .populate("customerId");
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.json({ success: true, appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit Review & auto-complete appointment
router.post("/review/:id", async (req, res) => {
  const { review, rating } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    appointment.review = review;
    appointment.rating = rating;
    appointment.status = "CP"; // Mark as completed after review
    await appointment.save();

    res.json({ success: true, message: "Review submitted & appointment marked completed", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH - Reschedule or Cancel Appointment
router.patch("/:id", async (req, res) => {
  const { date, time, status } = req.body; // send one or more fields
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (status) appointment.status = status; // CA for cancel

    await appointment.save();
    res.json({ success: true, message: "Appointment updated", appointment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
//DELETE - Delete appointment permanently
router.delete("/:id", async (req, res) => {
  try {
    const deletedAppt = await Appointment.findByIdAndDelete(req.params.id);
    if (!deletedAppt) return res.status(404).json({ message: "Appointment not found" });

    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


export default router;
