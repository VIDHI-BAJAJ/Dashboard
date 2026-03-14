const express = require("express");
const axios = require("axios");
const router  = express.Router();
const PortalIntegration = require("../models/PortalIntegration.js");



router.post("/publish", async (req, res) => {
  try {

    const { listing } = req.body;

    const agencyId = req.user?.agencyId || "22";

    // 1️⃣ Check portal activation
    const integration = await PortalIntegration.findOne({
      agencyId,
      portal: "realestate",
      active: true
    });

    if (!integration) {
      return res.status(400).json({
        success: false,
        message: "Portal not activated"
      });
    }

    // 2️⃣ Generate XML
    const xml = generateREAXML(listing);

    // 3️⃣ Get access token
    const token = await getAccessToken();

    // 4️⃣ Upload listing
    const response = await axios.post(
      "https://api.realestate.com.au/listing/v1/upload",
      xml,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/xml"
        }
      }
    );

    res.json({
      success: true,
      uploadId: response.data.uploadId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Publish failed"
    });

  }
});

module.exports = router;