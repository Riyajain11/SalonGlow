import express from "express";
import Stylist from "../models/Stylist.js";
const router = express.Router();

// Get all stylists
router.get("/", async (req, res) => {
    try {
        const stylists = await Stylist.find();
        res.json(stylists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get stylists by category
router.get("/category/:category", async (req, res) => {
    try {
        const stylists = await Stylist.find({ category: req.params.category });
        res.json(stylists);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get stylist by ID
router.get("/:id", async (req, res) => {
    try {
        const stylist = await Stylist.findById(req.params.id);
        if (!stylist) return res.status(404).json({ message: "Stylist not found" });
        res.json(stylist);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;