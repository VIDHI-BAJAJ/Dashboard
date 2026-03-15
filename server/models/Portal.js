// const mongoose = require("mongoose");
// const PortalSchema = new mongoose.Schema({
//   portalId: { type: String, enum: ["realestate", "domain"], required: true, unique: true },
//   status: { type: String, enum: ["none", "pending", "connected", "timeout"], default: "none" },
//   ticketNumber: { type: String, default: null },
//   syncInitiatedAt: { type: Date, default: null },
//   connectedAt: { type: Date, default: null },
//   timeoutAt: { type: Date, default: null },
// }, { timestamps: true });
// module.exports = mongoose.model("Portal", PortalSchema);


// models/Portal.js
const mongoose = require("mongoose");

const PortalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  portalId: {
    type: String,
    enum: ["realestate", "domain"],
    required: true,
  },
  status: {
    type: String,
    enum: ["none", "pending", "connected", "timeout"],
    default: "none",
  },
  // ── REA Credentials (per agent) ──
  agentId:      { type: String, default: null }, // e.g. "XNWTEL"
  clientId:     { type: String, default: null }, // REA OAuth Client ID
  clientSecret: { type: String, default: null }, // REA OAuth Client Secret
  // ── OAuth Token (auto-managed) ──
  accessToken:     { type: String, default: null },
  tokenExpiresAt:  { type: Date,   default: null },
  // ── Sync tracking ──
  ticketNumber:    { type: String, default: null },
  syncInitiatedAt: { type: Date,   default: null },
  connectedAt:     { type: Date,   default: null },
  timeoutAt:       { type: Date,   default: null },
}, { timestamps: true });

// One portal doc per user per portal
PortalSchema.index({ userId: 1, portalId: 1 }, { unique: true });

module.exports = mongoose.model("Portal", PortalSchema);