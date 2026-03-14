const mongoose = require("mongoose");
const PortalSchema = new mongoose.Schema({
  portalId: { type: String, enum: ["realestate", "domain"], required: true, unique: true },
  status: { type: String, enum: ["none", "pending", "connected", "timeout"], default: "none" },
  ticketNumber: { type: String, default: null },
  syncInitiatedAt: { type: Date, default: null },
  connectedAt: { type: Date, default: null },
  timeoutAt: { type: Date, default: null },
}, { timestamps: true });
module.exports = mongoose.model("Portal", PortalSchema);