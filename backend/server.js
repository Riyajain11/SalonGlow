// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

import authRoutes from "./routes/auth.js";
import stylistRoutes from "./routes/stylist.js";
import appointmentRoutes from "./routes/appointment.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stylist", stylistRoutes);
app.use("/api/appointment", appointmentRoutes);

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Handle React routing - serve index.html for non-API requests
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));