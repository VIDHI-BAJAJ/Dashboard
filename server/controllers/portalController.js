// controllers/portalController.js
const crypto = require("crypto");
const Portal  = require("../models/Portal");
const Listing = require("../models/Listing");
const axios   = require("axios");
const { startPolling } = require("../services/reaWatcher");
const { getValidToken } = require("../services/reaAuth");

const REA_LISTINGS_URL = "https://api.realestate.com.au/listings";

// ── Encryption helpers (AES-256-CBC) ──────────────────────────
// Uses ENCRYPTION_KEY from .env (must be exactly 32 characters)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH      = 16;

function encrypt(text) {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 characters in .env");
  }
  const iv       = crypto.randomBytes(IV_LENGTH);
  const cipher   = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  // Store as "ivHex:encryptedHex" — both needed to decrypt
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  if (!text || !text.includes(":")) return text; // already plain (legacy)
  const [ivHex, encryptedHex] = text.split(":");
  const iv            = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher      = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  const decrypted     = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
}

// ─────────────────────────────────────────────────────────────
// POST /api/portal/setup-sync
// Saves credentials (clientSecret encrypted) + starts polling
// Body: { agentId, clientId, clientSecret }
// ─────────────────────────────────────────────────────────────
const setupSync = async (req, res) => {
  try {
    const userId = req.user._id;
    const { agentId, clientId, clientSecret } = req.body;

    if (!agentId || !clientId || !clientSecret) {
      return res.status(400).json({
        message: "Agent ID, Client ID and Client Secret are all required",
      });
    }

    // Encrypt clientSecret before saving to MongoDB
    const encryptedSecret = encrypt(clientSecret);

    await Portal.findOneAndUpdate(
      { userId, portalId: "realestate" },
      {
        userId,
        agentId,
        clientId,
        clientSecret:    encryptedSecret, // ← stored encrypted ✅
        status:          "pending",
        syncInitiatedAt: new Date(),
        ticketNumber:    null,
        connectedAt:     null,
        timeoutAt:       null,
        accessToken:     null,
        tokenExpiresAt:  null,
      },
      { upsert: true, new: true }
    );

    // Start watching inbox for REA confirmation email
    startPolling(userId);

    return res.status(200).json({
      success: true,
      status:  "pending",
      message: "Credentials saved securely. Watching inbox for REA confirmation.",
    });

  } catch (error) {
    console.error("setupSync error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// GET /api/portal/status
// Returns portal status — never exposes clientSecret
// ─────────────────────────────────────────────────────────────
const getPortalStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const portal = await Portal.findOne(
      { userId, portalId: "realestate" },
      "status ticketNumber connectedAt agentId" // safe fields only — no clientSecret
    );

    if (!portal) {
      return res.status(200).json({ status: "none", ticketNumber: null, connectedAt: null });
    }

    return res.status(200).json({
      status:       portal.status,
      ticketNumber: portal.ticketNumber,
      connectedAt:  portal.connectedAt,
      agentId:      portal.agentId,
    });

  } catch (error) {
    console.error("getPortalStatus error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/portal/retry
// Resets status and restarts polling
// ─────────────────────────────────────────────────────────────
const retrySync = async (req, res) => {
  try {
    const userId = req.user._id;

    await Portal.findOneAndUpdate(
      { userId, portalId: "realestate" },
      {
        status:          "pending",
        ticketNumber:    null,
        syncInitiatedAt: new Date(),
        connectedAt:     null,
        timeoutAt:       null,
      },
      { upsert: true, new: true }
    );

    startPolling(userId);

    return res.status(200).json({ success: true, status: "pending" });

  } catch (error) {
    console.error("retrySync error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/portal/publish
// Publishes selected listings to REA API
// Body: { listingIds: ["id1", "id2"] }
// ─────────────────────────────────────────────────────────────
const publishListings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listingIds } = req.body;

    if (!listingIds || listingIds.length === 0) {
      return res.status(400).json({ message: "No listings selected" });
    }

    const portal = await Portal.findOne({ userId, portalId: "realestate" });
    if (!portal || portal.status !== "connected") {
      return res.status(400).json({ message: "REA portal not connected" });
    }

    // Get valid OAuth token (auto-refreshes if expired)
    const accessToken = await getValidToken(userId);
    const agentId     = portal.agentId;

    const listings = await Listing.find({ _id: { $in: listingIds } });
    const results  = [];
    const errors   = [];

    for (const listing of listings) {
      try {
        const payload  = buildREAPayload(listing, agentId);
        const response = await axios.post(REA_LISTINGS_URL, payload, {
          headers: {
            Authorization:  `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            Accept:         "application/json",
          },
        });

        await Listing.findByIdAndUpdate(listing._id, {
          "rea_portal.status":       "published",
          "rea_portal.connected_at": new Date(),
        });

        results.push({ listingId: listing._id, reaId: response.data?.id || null, status: "published" });
        console.log(`✅ Published listing ${listing._id} to REA`);

      } catch (err) {
        const errorMsg = err.response?.data || err.message;
        console.error(`❌ Failed listing ${listing._id}:`, errorMsg);
        errors.push({ listingId: listing._id, error: JSON.stringify(errorMsg) });
      }
    }

    return res.status(200).json({
      success:   errors.length === 0,
      published: results,
      failed:    errors,
      message:   `${results.length} published, ${errors.length} failed`,
    });

  } catch (error) {
    console.error("publishListings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// BUILD REA PAYLOAD
// Maps MongoDB listing → REA API format
// ─────────────────────────────────────────────────────────────
function buildREAPayload(listing, agentId) {
  const addr = listing.property?.address  || {};
  const feat = listing.property?.features || {};
  return {
    agentId,
    uniqueId:    listing._id.toString(),
    listingType: listing.listingType || "residential",
    status:      "active",
    address: {
      streetNumber: addr.streetNumber || "",
      street:       addr.street       || "",
      suburb:       addr.suburb       || "",
      state:        addr.state        || "",
      postcode:     addr.postcode     || "",
      country:      addr.country      || "AUS",
    },
    headline:    listing.property?.headline    || "",
    description: listing.property?.description || "",
    price:       listing.property?.price       || "",
    priceView:   listing.property?.priceView   || "",
    features: {
      bedrooms:  feat.bedrooms  || 0,
      bathrooms: feat.bathrooms || 0,
      garages:   feat.garages   || 0,
    },
    images: (listing.property?.images || []).map((url, i) => ({ url, order: i + 1 })),
    agent: {
      id:    listing.agent?.id     || agentId,
      name:  listing.agent?.name   || "",
      email: listing.agent?.email  || "",
      phone: listing.agent?.mobile || "",
    },
  };
}

// Export decrypt so reaAuth can use it too
module.exports = { setupSync, getPortalStatus, retrySync, publishListings, decrypt };