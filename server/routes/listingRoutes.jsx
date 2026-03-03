const express = require("express");
const router  = express.Router();
const Listing = require("../models/Listing.jsx");

// ── POST /api/listings — Create new listing ────────────────────────
router.post("/", async (req, res) => {
  try {
    const listing = new Listing(req.body);
    const saved   = await listing.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error("Create listing error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── GET /api/listings — Get all listings (newest first) ────────────
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json({ success: true, data: listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/listings/:id — Get single listing ─────────────────────
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/listings/:id — Update listing ─────────────────────────
router.put("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!listing) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: listing });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/listings/:id — Delete listing ──────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Listing deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;