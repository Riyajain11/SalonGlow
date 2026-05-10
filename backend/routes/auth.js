import express from "express";
import Customer from "../models/Customer.js";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

// Demo mode OTP store (temporary - in production use Redis)
const otpStore = new Map();

// Send OTP - DEMO MODE (No Twilio)
router.post("/send-otp", async (req, res) => {
  const { phone } = req.body;
  
  if (!phone || phone.length < 10) {
    return res.status(400).json({ success: false, message: "Valid phone number required" });
  }

  // Generate random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store OTP with expiry (5 minutes)
  otpStore.set(phone, {
    otp: otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  });
  
  console.log(`📱 DEMO MODE - OTP for ${phone}: ${otp}`);
  
  res.json({ 
    success: true, 
    message: "OTP sent successfully",
    demoOtp: otp // Will be shown in alert on frontend
  });
});

// Verify OTP - DEMO MODE
router.post("/verify-otp", async (req, res) => {
  const { phone, otp } = req.body;
 
  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone and OTP required" });
  }

  try {
    // Check OTP in store
    const storedData = otpStore.get(phone);
    
    if (!storedData) {
      return res.status(400).json({ message: "OTP expired or not requested. Please request new OTP." });
    }
    
    if (storedData.expiresAt < Date.now()) {
      otpStore.delete(phone);
      return res.status(400).json({ message: "OTP has expired. Please request new OTP." });
    }
    
    if (storedData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP. Please try again." });
    }
    
    // OTP verified - find or create customer
    let customer = await Customer.findOne({ phone });
    
    if (!customer) {
      customer = new Customer({ phone, status: "active" });
      await customer.save();
    }
    
    // Clear OTP after successful verification
    otpStore.delete(phone);
    
    res.json({ 
      success: true, 
      message: "OTP verified successfully",
      customer: {
        _id: customer._id,
        phone: customer.phone,
        name: customer.name,
        age: customer.age,
        gender: customer.gender
      }
    });
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

// Get customer by ID
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