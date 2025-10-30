import express from "express";
import Customer from "../models/Customer.js";
import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();

  let customer = await Customer.findOne({ phone });
  if (!customer) customer = new Customer({ phone, otp });
  else customer.otp = otp;
  await customer.save();

  // Send OTP via Twilio
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });
  } catch (err) {
    console.error("Twilio Error:", err);
    return res.status(500).json({ success: false, message: "Failed to send OTP" });
  }

  res.json({ success: true, message: "OTP sent successfully" });
});

// Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ message: "Phone and OTP required" });

  try {
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(400).json({ message: "Customer not found" });

    if (customer.otp === otp) {
      // OTP matches
      customer.otp = ""; // clear OTP after verification
      await customer.save();
      res.json({ success: true, customer });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Register or update customer details
router.post("/register", async (req, res) => {
  const { customerId, name, age, gender } = req.body;
  if (!customerId) return res.status(400).json({ message: "Customer ID required" });

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ message: "Customer not found" });

    if (name) customer.name = name;
    if (age) customer.age = age;
    if (gender) customer.gender = gender;

    await customer.save();
    res.json({ success: true, customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/customer/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json({ success: true, customer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
