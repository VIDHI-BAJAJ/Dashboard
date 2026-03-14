// const express = require("express");
// const router = express.Router();
// const { setupSync, getPortalStatus, retrySync } = require("../controllers/portalController");
// const { protect } = require("../middleware/auth");

// router.post("/setup-sync", authMiddleware, setupSync);
// router.get("/status", authMiddleware, getPortalStatus);
// router.post("/retry", authMiddleware, retrySync);

// module.exports = router;


// routes/portalRoutes.js

const express = require("express");
const router = express.Router();
const { setupSync, getPortalStatus, retrySync } = require("../controllers/portalController");
const { protect } = require("../middleware/auth");

// ✅ changed authMiddleware → protect on all 3 lines
router.post("/setup-sync", protect, setupSync);
router.get("/status", protect, getPortalStatus);
router.post("/retry", protect, retrySync);

module.exports = router;