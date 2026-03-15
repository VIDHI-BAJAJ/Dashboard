// services/reaAuth.js
// Handles REA OAuth2 token — fetch + auto-refresh
// REA uses standard client_credentials flow

const axios = require("axios");
const Portal = require("../models/Portal");

const REA_TOKEN_URL = "https://api.realestate.com.au/credentials/token";

// ─────────────────────────────────────────────────
// GET VALID TOKEN FOR A USER
// Returns existing token if still valid
// Auto-fetches new one if expired
// ─────────────────────────────────────────────────
async function getValidToken(userId) {
  const portal = await Portal.findOne({ userId, portalId: "realestate" });

  if (!portal) {
    throw new Error("REA portal not connected for this user");
  }
  if (!portal.clientId || !portal.clientSecret) {
    throw new Error("REA Client ID or Client Secret missing — check Setup Sync");
  }

  // Check if existing token is still valid (5 min buffer)
  const now = new Date();
  const fiveMinutes = 5 * 60 * 1000;
  if (
    portal.accessToken &&
    portal.tokenExpiresAt &&
    (new Date(portal.tokenExpiresAt) - now) > fiveMinutes
  ) {
    console.log("✅ Using cached REA token");
    return portal.accessToken;
  }

  // Token missing or expired — fetch new one
  console.log("🔄 Fetching fresh REA OAuth token...");
  const tokenData = await fetchNewToken(portal.clientId, portal.clientSecret);

  // Save to DB for reuse
  await Portal.findOneAndUpdate(
    { userId, portalId: "realestate" },
    {
      accessToken:    tokenData.access_token,
      tokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
    }
  );

  console.log("✅ REA token fetched and saved");
  return tokenData.access_token;
}

// ─────────────────────────────────────────────────
// FETCH NEW TOKEN FROM REA
// POST https://api.realestate.com.au/credentials/token
// Body: grant_type, client_id, client_secret
// ─────────────────────────────────────────────────
async function fetchNewToken(clientId, clientSecret) {
  try {
    const response = await axios.post(
      REA_TOKEN_URL,
      new URLSearchParams({
        grant_type:    "client_credentials",
        client_id:     clientId,
        client_secret: clientSecret,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    if (!response.data.access_token) {
      throw new Error("No access_token in REA response");
    }

    return response.data;
    // response.data = { access_token, expires_in, token_type }

  } catch (error) {
    const msg = error.response?.data || error.message;
    console.error("❌ REA token fetch failed:", msg);
    throw new Error(`REA OAuth failed: ${JSON.stringify(msg)}`);
  }
}

module.exports = { getValidToken };