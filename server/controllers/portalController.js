// const Portal = require("../models/Portal");
// const { startPolling } = require("../services/reaWatcher");

// const setupSync = async (req, res) => {
//   try {
//     await Portal.findOneAndUpdate(
//       { portalId: "realestate" },
//       { status: "pending", syncInitiatedAt: new Date(), ticketNumber: null, connectedAt: null, timeoutAt: null },
//       { upsert: true, new: true }
//     );
//     startPolling();
//     return res.status(200).json({ success: true, status: "pending" });
//   } catch (error) {
//     console.error("setupSync error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// const getPortalStatus = async (req, res) => {
//   try {
//     const portal = await Portal.findOne({ portalId: "realestate" });
//     if (!portal) return res.status(200).json({ status: "none", ticketNumber: null, connectedAt: null });
//     return res.status(200).json({ status: portal.status, ticketNumber: portal.ticketNumber, connectedAt: portal.connectedAt });
//   } catch (error) {
//     console.error("getPortalStatus error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// const retrySync = async (req, res) => {
//   try {
//     await Portal.findOneAndUpdate(
//       { portalId: "realestate" },
//       { status: "pending", ticketNumber: null, syncInitiatedAt: new Date(), connectedAt: null, timeoutAt: null },
//       { upsert: true, new: true }
//     );
//     startPolling();
//     return res.status(200).json({ success: true, status: "pending" });
//   } catch (error) {
//     console.error("retrySync error:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// module.exports = { setupSync, getPortalStatus, retrySync };


// controllers/portalController.js

const Portal = require("../models/Portal");
const { startPolling } = require("../services/reaWatcher");
const { getValidToken } = require("../services/reaAuth");
const Listing = require("../models/Listing");
const axios = require("axios");

const REA_LISTINGS_URL = "https://api.realestate.com.au/listings";
// ↑ Confirm exact endpoint from REA partner docs

// ─────────────────────────────────────────────────
// POST /api/portal/setup-sync
// Saves agent credentials + starts IMAP polling
// Body: { agentId, clientId, clientSecret }
// ─────────────────────────────────────────────────
const setupSync = async (req, res) => {
  try {
    const userId = req.user._id;
    const { agentId, clientId, clientSecret } = req.body;

    // Validate — all 3 required
    if (!agentId || !clientId || !clientSecret) {
      return res.status(400).json({
        message: "Agent ID, Client ID and Client Secret are all required",
      });
    }

    // Save credentials + set status to pending
    await Portal.findOneAndUpdate(
      { userId, portalId: "realestate" },
      {
        userId,
        agentId,
        clientId,
        clientSecret,
        status:          "pending",
        syncInitiatedAt: new Date(),
        ticketNumber:    null,
        connectedAt:     null,
        timeoutAt:       null,
        accessToken:     null, // clear old token when credentials change
        tokenExpiresAt:  null,
      },
      { upsert: true, new: true }
    );

    // Start watching inbox for REA confirmation email
    startPolling(userId);

    return res.status(200).json({
      success: true,
      status:  "pending",
      message: "Credentials saved. Watching inbox for REA confirmation.",
    });

  } catch (error) {
    console.error("setupSync error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────
// GET /api/portal/status
// Returns current portal status for this user
// ─────────────────────────────────────────────────
const getPortalStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const portal = await Portal.findOne(
      { userId, portalId: "realestate" },
      "status ticketNumber connectedAt agentId" // only return safe fields
    );

    if (!portal) {
      return res.status(200).json({ status: "none", ticketNumber: null, connectedAt: null });
    }

    return res.status(200).json({
      status:       portal.status,
      ticketNumber: portal.ticketNumber,
      connectedAt:  portal.connectedAt,
      agentId:      portal.agentId,
      // NOTE: never return clientId/clientSecret to frontend
    });

  } catch (error) {
    console.error("getPortalStatus error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// ─────────────────────────────────────────────────
// POST /api/portal/retry
// Resets status and restarts polling
// ─────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────
// POST /api/portal/publish
// Publishes selected listings to REA
// Body: { listingIds: ["id1", "id2"] }
// ─────────────────────────────────────────────────
const publishListings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { listingIds } = req.body;

    if (!listingIds || listingIds.length === 0) {
      return res.status(400).json({ message: "No listings selected" });
    }

    // Get agent's portal credentials
    const portal = await Portal.findOne({ userId, portalId: "realestate" });
    if (!portal || portal.status !== "connected") {
      return res.status(400).json({ message: "REA portal not connected" });
    }

    // Get valid OAuth token (auto-refreshes if expired)
    const accessToken = await getValidToken(userId);
    const agentId = portal.agentId;

    // Fetch all selected listings from MongoDB
    const listings = await Listing.find({ _id: { $in: listingIds } });

    const results = [];
    const errors  = [];

    for (const listing of listings) {
      try {
        // Build REA API payload from your listing data
        const payload = buildREAPayload(listing, agentId);

        // POST to REA Listings API
        const response = await axios.post(
          REA_LISTINGS_URL,
          payload,
          {
            headers: {
              Authorization:  `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept:         "application/json",
            },
          }
        );

        // Mark listing as published in your DB
        await Listing.findByIdAndUpdate(listing._id, {
          "rea_portal.status":       "published",
          "rea_portal.connected_at": new Date(),
        });

        results.push({
          listingId: listing._id,
          reaId:     response.data?.id || null,
          status:    "published",
        });

        console.log(`✅ Published listing ${listing._id} to REA`);

      } catch (err) {
        const errorMsg = err.response?.data || err.message;
        console.error(`❌ Failed to publish listing ${listing._id}:`, errorMsg);
        errors.push({
          listingId: listing._id,
          error:     JSON.stringify(errorMsg),
        });
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

// ─────────────────────────────────────────────────
// BUILD REA API PAYLOAD
// Maps your MongoDB listing → REA API format
// Adjust field names to match REA API docs exactly
// ─────────────────────────────────────────────────
function buildREAPayload(listing, agentId) {
  const addr = listing.property?.address || {};
  const feat = listing.property?.features || {};

  return {
    // ── Identity ──
    agentId:     agentId,          // e.g. "XNWTEL"
    uniqueId:    listing._id.toString(),
    listingType: listing.listingType || "residential",
    status:      "active",

    // ── Address ──
    address: {
      streetNumber: addr.streetNumber || "",
      street:       addr.street       || "",
      suburb:       addr.suburb       || "",
      state:        addr.state        || "",
      postcode:     addr.postcode     || "",
      country:      addr.country      || "AUS",
    },

    // ── Details ──
    headline:    listing.property?.headline    || "",
    description: listing.property?.description || "",
    price:       listing.property?.price       || "",
    priceView:   listing.property?.priceView   || "",

    // ── Features ──
    features: {
      bedrooms:  feat.bedrooms  || 0,
      bathrooms: feat.bathrooms || 0,
      garages:   feat.garages   || 0,
    },

    // ── Media ──
    images: (listing.property?.images || []).map((url, i) => ({
      url:   url,
      order: i + 1,
    })),

    // ── Agent ──
    agent: {
      id:    listing.agent?.id    || agentId,
      name:  listing.agent?.name  || "",
      email: listing.agent?.email || "",
      phone: listing.agent?.mobile || "",
    },
  };
}

module.exports = { setupSync, getPortalStatus, retrySync, publishListings };