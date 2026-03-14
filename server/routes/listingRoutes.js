// routes/listingRoutes.js
const express = require("express");
const Listing = require("../models/Listing");

const router = express.Router();

// ── POST /api/listings — save new listing ─────────────────────
router.post("/", async (req, res) => {
  try {
    const listing = new Listing(req.body);
    await listing.save();
    return res.status(201).json({ success: true, id: listing._id, listing });
  } catch (err) {
    console.error("Save listing error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/listings — get all listings ─────────────────────
router.get("/", async (req, res) => {
  try {
    const { status, listingType, suburb } = req.query;
    const filter = {};
    if (status)      filter.status = status;
    if (listingType) filter.listingType = listingType;
    if (suburb)      filter["property.address.suburb"] = new RegExp(suburb, "i");

    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    return res.json({ success: true, listings });
  } catch (err) {
    console.error("Fetch listings error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/listings/:id — get single listing ────────────────
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });
    return res.json({ success: true, listing });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── PUT /api/listings/:id — update listing ────────────────────
router.put("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });
    return res.json({ success: true, listing });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── DELETE /api/listings/:id — delete listing ─────────────────
router.delete("/:id", async (req, res) => {
  try {
    const listing = await Listing.findByIdAndDelete(req.params.id);
    if (!listing) return res.status(404).json({ success: false, message: "Listing not found" });
    return res.json({ success: true, message: "Listing deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;