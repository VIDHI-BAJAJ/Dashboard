const Portal = require("../models/Portal");
const { startPolling } = require("../services/reaWatcher");

const setupSync = async (req, res) => {
  try {
    await Portal.findOneAndUpdate(
      { portalId: "realestate" },
      { status: "pending", syncInitiatedAt: new Date(), ticketNumber: null, connectedAt: null, timeoutAt: null },
      { upsert: true, new: true }
    );
    startPolling();
    return res.status(200).json({ success: true, status: "pending" });
  } catch (error) {
    console.error("setupSync error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getPortalStatus = async (req, res) => {
  try {
    const portal = await Portal.findOne({ portalId: "realestate" });
    if (!portal) return res.status(200).json({ status: "none", ticketNumber: null, connectedAt: null });
    return res.status(200).json({ status: portal.status, ticketNumber: portal.ticketNumber, connectedAt: portal.connectedAt });
  } catch (error) {
    console.error("getPortalStatus error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

const retrySync = async (req, res) => {
  try {
    await Portal.findOneAndUpdate(
      { portalId: "realestate" },
      { status: "pending", ticketNumber: null, syncInitiatedAt: new Date(), connectedAt: null, timeoutAt: null },
      { upsert: true, new: true }
    );
    startPolling();
    return res.status(200).json({ success: true, status: "pending" });
  } catch (error) {
    console.error("retrySync error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { setupSync, getPortalStatus, retrySync };