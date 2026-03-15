// controllers/portalController.js
const crypto   = require("crypto");
const Portal   = require("../models/Portal");
const Listing  = require("../models/Listing");
const axios    = require("axios");
const { startPolling }   = require("../services/reaWatcher");
const { getValidToken }  = require("../services/reaAuth");
const { generateREAXML } = require("../services/reaXmlGenerator");

const REA_UPLOAD_URL = "https://api.realestate.com.au/listing/v1/upload";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH      = 16;

function encrypt(text) {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 characters in .env");
  }
  const iv        = crypto.randomBytes(IV_LENGTH);
  const cipher    = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
  if (!text || !text.includes(":")) return text;
  const [ivHex, encryptedHex] = text.split(":");
  const iv            = Buffer.from(ivHex, "hex");
  const encryptedText = Buffer.from(encryptedHex, "hex");
  const decipher      = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY), iv);
  const decrypted     = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
  return decrypted.toString();
}

const setupSync = async (req, res) => {
  try {
    const userId = req.user._id;
    const { agentId, clientId, clientSecret } = req.body;
    if (!agentId || !clientId || !clientSecret) {
      return res.status(400).json({ message: "Agent ID, Client ID and Client Secret are all required" });
    }
    await Portal.findOneAndUpdate(
      { userId, portalId: "realestate" },
      {
        userId, agentId, clientId,
        clientSecret:    encrypt(clientSecret),
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
    startPolling(userId);
    return res.status(200).json({ success: true, status: "pending" });
  } catch (error) {
    console.error("setupSync error:", error);
    return res.status(500).json({ message: error.message || "Server error" });
  }
};

const getPortalStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const portal = await Portal.findOne(
      { userId, portalId: "realestate" },
      "status ticketNumber connectedAt agentId"
    );
    if (!portal) return res.status(200).json({ status: "none", ticketNumber: null, connectedAt: null });
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

const retrySync = async (req, res) => {
  try {
    const userId = req.user._id;
    await Portal.findOneAndUpdate(
      { userId, portalId: "realestate" },
      { status: "pending", ticketNumber: null, syncInitiatedAt: new Date(), connectedAt: null, timeoutAt: null },
      { upsert: true, new: true }
    );
    startPolling(userId);
    return res.status(200).json({ success: true, status: "pending" });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────
// POST /api/portal/publish
// ─────────────────────────────────────────────────────────────
const publishListings = async (req, res) => {
  try {
    console.log("🚀 publishListings called");
    console.log("👤 userId:", req.user?._id);
    console.log("📋 listingIds:", req.body?.listingIds);

    const userId     = req.user._id;
    const { listingIds } = req.body;

    if (!listingIds || listingIds.length === 0) {
      return res.status(400).json({ message: "No listings selected" });
    }

    const portal = await Portal.findOne({ userId, portalId: "realestate" });
    if (!portal || portal.status !== "connected") {
      return res.status(400).json({ message: "REA portal not connected" });
    }

    const accessToken = await getValidToken(userId);
    const agentId     = portal.agentId;

    // Get backend base URL for converting relative image URLs to absolute
    const backendUrl = process.env.BACKEND_URL || "https://dashboard-pura.onrender.com";

    const listings = await Listing.find({ _id: { $in: listingIds } });
    const results  = [];
    const errors   = [];

    for (const listing of listings) {
      try {
        // ── Fix 1: Force status to "active" for publishing ──
        // Never publish a "withdrawn" listing — that removes it from REA
        // Always send as active (current) when user clicks Publish
        const listingForXML = listing.toObject();
        listingForXML.status = "active";

        // ── Fix 2: Convert relative image URLs to absolute ──
        // REA needs full URLs like https://... not /api/files/...
        if (listingForXML.property?.images) {
          listingForXML.property.images = listingForXML.property.images.map(url => {
            if (url.startsWith("http")) return url; // already absolute
            return `${backendUrl}${url}`;           // prepend backend URL
          });
        }

        console.log("📸 Images after fix:", listingForXML.property?.images);
        console.log("📊 Status for XML:", listingForXML.status);

        // ── Generate XML ──
        const xmlPayload = generateREAXML(listingForXML, agentId);
        console.log("📄 Generated XML:\n", xmlPayload);

        // ── Upload to REA ──
        const response = await axios.post(
          REA_UPLOAD_URL,
          xmlPayload,
          {
            headers: {
              Authorization:  `Bearer ${accessToken}`,
              "Content-Type": "application/xml",
              Accept:         "application/json",
            },
          }
        );

        console.log("✅ REA response status:", response.status);
        console.log("✅ REA response data:", JSON.stringify(response.data));

        // ── Fix 3: Only mark as published if truly accepted ──
        // REA returns 202 Accepted on success
        if (response.status === 202 || response.status === 200) {
          await Listing.findByIdAndUpdate(listing._id, {
            "rea_portal.status":       "published",
            "rea_portal.connected_at": new Date(),
          });
          results.push({
            listingId: listing._id,
            headline:  listing.property?.headline || "Untitled",
            status:    "published",
            reaData:   response.data,
          });
          console.log(`✅ Listing ${listing._id} published to REA`);
        } else {
          // REA returned unexpected status
          errors.push({
            listingId: listing._id,
            headline:  listing.property?.headline || "Untitled",
            error:     `Unexpected status: ${response.status}`,
          });
        }

      } catch (err) {
        const errorMsg = err.response?.data || err.message;
        console.error(`❌ Failed listing ${listing._id}:`, JSON.stringify(errorMsg, null, 2));
        errors.push({
          listingId: listing._id,
          headline:  listing.property?.headline || "Untitled",
          error:     typeof errorMsg === "object" ? JSON.stringify(errorMsg) : errorMsg,
        });
      }
    }

    // ── Fix 3 continued: only success:true if ALL published ──
    return res.status(200).json({
      success:   results.length > 0 && errors.length === 0,
      published: results,
      failed:    errors,
      message:   `${results.length} published, ${errors.length} failed`,
    });

  } catch (error) {
    console.error("publishListings error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { setupSync, getPortalStatus, retrySync, publishListings, decrypt };