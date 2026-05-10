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

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/stylist", stylistRoutes);
app.use("/api/appointment", appointmentRoutes);

// IMPORTANT: Serve frontend static files (for production)
// This assumes your frontend build is in '../frontend/dist'
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// IMPORTANT: Handle React routing - serve index.html for all non-API routes
app.get('*', (req, res, next) => {
  // Skip API routes (they should already be handled above)
  if (req.path.startsWith('/api')) {
    return next();
  }
  // Serve index.html for all other routes (React Router handles the rest)
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));