// services/reaAuth.js
const axios  = require("axios");
const crypto = require("crypto");
const Portal = require("../models/Portal");

const REA_TOKEN_URL  = "https://api.realestate.com.au/oauth/token";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

function decrypt(text) {
  if (!text) return text;
  if (!text.includes(":")) return text;
  try {
    const [ivHex, encryptedHex] = text.split(":");
    const iv            = Buffer.from(ivHex, "hex");
    const encryptedText = Buffer.from(encryptedHex, "hex");
    const decipher      = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(ENCRYPTION_KEY),
      iv
    );
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.error("❌ Decrypt failed:", err.message);
    return text;
  }
}

async function getValidToken(userId) {
  const portal = await Portal.findOne({ userId, portalId: "realestate" });

  if (!portal) throw new Error("REA portal not connected for this user");
  if (!portal.clientId || !portal.clientSecret) {
    throw new Error("REA credentials missing — please re-run Setup Sync");
  }

  // Check cached token
  const now     = new Date();
  const fiveMin = 5 * 60 * 1000;
  if (
    portal.accessToken &&
    portal.tokenExpiresAt &&
    (new Date(portal.tokenExpiresAt) - now) > fiveMin
  ) {
    console.log("✅ Using cached REA token");
    return portal.accessToken;
  }

  const decryptedSecret = decrypt(portal.clientSecret);
  console.log("🔄 Fetching fresh REA OAuth token...");

  const tokenData = await fetchNewToken(portal.clientId, decryptedSecret);

  await Portal.findOneAndUpdate(
    { userId, portalId: "realestate" },
    {
      accessToken:    tokenData.access_token,
      tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    }
  );

  console.log("✅ Fresh REA token saved");
  return tokenData.access_token;
}

async function fetchNewToken(clientId, clientSecret) {
  try {
    // ── REA uses Basic Auth in header (Credentials Location: header) ──
    // Encode as Base64: "clientId:clientSecret"
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    console.log("📤 Calling REA OAuth with Basic Auth header...");

    const response = await axios.post(
      REA_TOKEN_URL,
      new URLSearchParams({
        grant_type: "client_credentials",
        // credentials go in header, NOT body
      }),
      {
        headers: {
          "Content-Type":  "application/x-www-form-urlencoded",
          "Authorization": `Basic ${basicAuth}`, // ← correct location
        },
      }
    );

    if (!response.data.access_token) {
      throw new Error("No access_token returned by REA");
    }

    console.log("✅ REA OAuth token received successfully");
    return response.data;

  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error("❌ REA token fetch failed:", JSON.stringify(msg, null, 2));
    throw new Error(`REA OAuth failed: ${JSON.stringify(msg)}`);
  }
}

module.exports = { getValidToken };