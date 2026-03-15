// services/reaAuth.js
// Handles REA OAuth2 token — fetch + auto-refresh
// Decrypts clientSecret before using it

const axios  = require("axios");
const crypto = require("crypto");
const Portal = require("../models/Portal");

const REA_TOKEN_URL  = "https://api.realestate.com.au/oauth/token";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// ── Decrypt clientSecret before sending to REA ────────────────
function decrypt(text) {
  if (!text) return text;
  // If not encrypted format (no colon separator) — return as-is
  if (!text.includes(":")) {
    console.log("⚠️ clientSecret appears to be plain text — using as-is");
    return text;
  }
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
    console.log("✅ clientSecret decrypted successfully");
    return decrypted.toString();
  } catch (err) {
    console.error("❌ Decrypt failed:", err.message);
    console.log("⚠️ Falling back to raw clientSecret");
    return text; // fallback to raw if decrypt fails
  }
}

// ─────────────────────────────────────────────────────────────
// GET VALID TOKEN FOR A USER
// Returns cached token if still valid, fetches new if expired
// ─────────────────────────────────────────────────────────────
async function getValidToken(userId) {
  const portal = await Portal.findOne({ userId, portalId: "realestate" });

  if (!portal) throw new Error("REA portal not connected for this user");
  if (!portal.clientId || !portal.clientSecret) {
    throw new Error("REA credentials missing — please re-run Setup Sync");
  }

  // ── Debug logs ──
  console.log("🔑 clientId:", portal.clientId);
  console.log("🔑 clientSecret in DB (first 20):", portal.clientSecret?.substring(0, 20));
  console.log("🔑 ENCRYPTION_KEY length:", ENCRYPTION_KEY?.length);

  // Check if cached token is still valid (5 min buffer)
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

  // Decrypt clientSecret before sending to REA
  const decryptedSecret = decrypt(portal.clientSecret);
  console.log("🔑 Decrypted secret FULL:", decryptedSecret);
;

  console.log("🔄 Fetching fresh REA OAuth token...");
  const tokenData = await fetchNewToken(portal.clientId, decryptedSecret);

  // Cache new token in DB
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

// ─────────────────────────────────────────────────────────────
// FETCH NEW TOKEN FROM REA
// POST https://api.realestate.com.au/oauth/token
// ─────────────────────────────────────────────────────────────
async function fetchNewToken(clientId, clientSecret) {
  try {
    console.log("📤 Calling REA OAuth:", REA_TOKEN_URL);
    console.log("   client_id:", clientId);
    console.log("   client_secret FULL:", clientSecret);
    console.log("   client_secret length:", clientSecret?.length);

    const response = await axios.post(
      REA_TOKEN_URL,
      new URLSearchParams({
        grant_type:    "client_credentials",
        client_id:     clientId,
        client_secret: clientSecret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (!response.data.access_token) {
      throw new Error("No access_token returned by REA");
    }

    console.log("✅ REA OAuth token received");
    return response.data;

  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error("❌ REA token fetch failed:", JSON.stringify(msg, null, 2));
    throw new Error(`REA OAuth failed: ${JSON.stringify(msg)}`);
  }
}

module.exports = { getValidToken };