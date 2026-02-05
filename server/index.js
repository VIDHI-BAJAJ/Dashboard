const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());
app.use(
  cors({
    origin: "*", // restrict later in prod
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ===================== CONFIG ===================== */
const PORT = process.env.PORT || 5000;
const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;

const headers = {
  Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
  "Content-Type": "application/json",
};

/* ===================== ROOT ===================== */
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

app.use('/api/portals/magicbricks', magicbricksRouter);

/* ===================== AIRTABLE FETCH (GENERIC) ===================== */
const fetchTable = async (tableName) => {
  let records = [];
  let offset;

  do {
    const response = await axios.get(`${BASE_URL}/${tableName}`, {
      headers,
      params: { pageSize: 100, offset },
    });

    records.push(...response.data.records);
    offset = response.data.offset;
  } while (offset);

  return records.map((r) => ({
    id: r.id,
    fields: r.fields,
    createdTime: r.createdTime,
  }));
};

/* ===================== GET REVENUE STATS ===================== */
app.get("/api/revenue-stats", async (req, res) => {
  try {
    const leads = await fetchTable("Leads");
    
    let totalBudgetMin = 0;
    let validLeadsCount = 0;
    
    leads.forEach(lead => {
      const budgetMin = lead.fields["Budget (Min)"];
      if (budgetMin && !isNaN(budgetMin)) {
        totalBudgetMin += Number(budgetMin);
        validLeadsCount++;
      }
    });
    
    const averageBudgetMin = validLeadsCount > 0 ? totalBudgetMin / validLeadsCount : 0;
    const targetRevenue = 10000000; // 10 crore target
    const achievedRevenue = averageBudgetMin; // Average of all Budget (Min)
    const percentage = targetRevenue > 0 ? Math.min((achievedRevenue / targetRevenue) * 100, 100) : 0;
    
    res.json({
      totalBudgetMin,
      averageBudgetMin,
      targetRevenue,
      achievedRevenue,
      percentage: Math.round(percentage * 10) / 10,
      validLeadsCount,
      totalLeadsCount: leads.length
    });
  } catch (err) {
    console.error("❌ Revenue Stats Error:", err);
    res.status(500).json({ error: "Failed to fetch revenue stats" });
  }
});

/* ===================== GET LEADS ===================== */
app.get("/api/leads", async (req, res) => {
  try {
    const data = await fetchTable("Leads");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

/* ===================== CREATE LEAD ===================== */
app.post("/api/leads", async (req, res) => {
  try {
    const { fields } = req.body;

    if (!fields) {
      return res.status(400).json({ error: "Fields are required" });
    }

    /* ===================== SELECT NORMALIZATION ===================== */

    const BED_MAP = {
      "Studio": "Studio",
      "1 BHK": "1",
      "2 BHK": "2",
      "3 BHK": "3",
      "4 BHK": "4+",
      "5+ BHK": "4+",
    };

    const TIMELINE_MAP = {
      "Immediate": "Now",
      "Now": "Now",
      "0-30d": "0-30d",
      "1-3 months": "0-30d",
      "30-90d": "30-90d",
      "3-6 months": "30-90d",
      "90d+": "90d+",
      "6-12 months": "90d+",
      "Unknown": "Unknown",
    };

    /* ===================== WHITELIST (CRITICAL) ===================== */
    const allowedFields = {
      "Full Name": fields["Full Name"] || "",
      Phone: fields.Phone || "",
      Email: fields.Email || null,
      Intent: fields.Intent || null,

      "Budget (Min)": fields["Budget (Min)"] !== undefined
        ? Number(fields["Budget (Min)"])
        : null,

      "Budget (Max)": fields["Budget (Max)"] !== undefined
        ? Number(fields["Budget (Max)"])
        : null,

      Areas: fields.Areas
        ? Array.isArray(fields.Areas)
          ? fields.Areas
          : [fields.Areas]
        : [],

      Beds: BED_MAP[fields.Beds] || null,
      Timeline: TIMELINE_MAP[fields.Timeline] || null,

      // Status can stay if it exists
      Status: "New",
    };

    console.log("📤 Airtable Payload:", allowedFields);

    const response = await axios.post(
      `${BASE_URL}/Leads`,
      { fields: allowedFields },
      { headers }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error("❌ Airtable Error:", error.response?.data || error.message);

    if (error.response) {
      return res.status(error.response.status).json({
        error: "Airtable validation error",
        details: error.response.data,
        message: error.response.data?.error?.message,
      });
    }

    res.status(500).json({ error: "Failed to create lead" });
  }
});

/* ===================== OPTIONAL TABLE ROUTES ===================== */
app.get("/api/tasks", async (req, res) => {
  try {
    res.json(await fetchTable("Tasks"));
  } catch {
    res.status(500).json({ error: "Failed to fetch Tasks" });
  }
});

app.get("/api/deals", async (req, res) => {
  try {
    res.json(await fetchTable("Deals"));
  } catch {
    res.status(500).json({ error: "Failed to fetch Deals" });
  }
});

app.get("/api/conversations", async (req, res) => {
  try {
    res.json(await fetchTable("Conversations"));
  } catch {
    res.status(500).json({ error: "Failed to fetch Conversations" });
  }
});

/* ===================== LISTINGS (MOCK) ===================== */
/* In production, replace with Airtable or DB persistence */
const listingsStore = [];

// In-memory portal connection + listing maps (per broker)
// In a real app, these would live in a proper database with broker auth
const portalConnections = new Map(); // brokerId -> { portal, status, brokerId, xmlFeedUrl, listingIds }
const portalListingMap = new Map(); // brokerId -> [listing]

app.get("/api/listings", (req, res) => {
  try {
    res.json(listingsStore);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

app.post("/api/listings", (req, res) => {
  try {
    const listing = req.body;
    if (!listing) return res.status(400).json({ error: "Listing required" });
    const id = listing.id || Date.now();
    const record = { ...listing, id };
    listingsStore.push(record);
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: "Failed to create listing" });
  }
});

/* ===================== MAGICBRICKS PORTAL INTEGRATION ===================== */

// Helper: basic XML escaping for text nodes
const xmlEscape = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// Helper: build a simple Magicbricks-style XML feed for a broker
const buildMagicbricksXml = (brokerId, listings) => {
  const generatedAt = new Date().toISOString();

  const itemsXml = listings
    .map((l) => {
      const id = l.id || "";
      const title = l.name || l.propertyTitle || "";
      const description = l.propertyDescription || "";
      const city = l.city || l.operatingCity || "";
      const locality = l.location || l.localityArea || "";
      const price = l.price || l.propertyPrice || "";
      const area = l.area || l.superBuiltUpArea || "";
      const areaUnit = l.areaUnit || "sq.ft";
      const bedrooms = l.bedrooms || l.bhkType || "";
      const bathrooms = l.bathrooms || "";
      const propertyType = l.propertyType || "";
      const transactionType = l.transactionType || "";
      const projectName = l.projectName || "";
      const reraNumber = l.reraNumber || "";
      const imageUrl = l.image || "";

      return `
    <property id="${xmlEscape(id)}">
      <title>${xmlEscape(title)}</title>
      <description>${xmlEscape(description)}</description>
      <city>${xmlEscape(city)}</city>
      <locality>${xmlEscape(locality)}</locality>
      <price>${xmlEscape(price)}</price>
      <area unit="${xmlEscape(areaUnit)}">${xmlEscape(area)}</area>
      <bedrooms>${xmlEscape(bedrooms)}</bedrooms>
      <bathrooms>${xmlEscape(bathrooms)}</bathrooms>
      <property_type>${xmlEscape(propertyType)}</property_type>
      <transaction_type>${xmlEscape(transactionType)}</transaction_type>
      <project_name>${xmlEscape(projectName)}</project_name>
      <rera_number>${xmlEscape(reraNumber)}</rera_number>
      ${imageUrl ? `<image_url>${xmlEscape(imageUrl)}</image_url>` : ""}
    </property>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<magicbricks_feed generated_at="${xmlEscape(generatedAt)}">
  <broker id="${xmlEscape(brokerId)}">
    <properties>${itemsXml || "\n    "}</properties>
  </broker>
</magicbricks_feed>`;
};

/**
 * Initiate Magicbricks connection for a broker.
 * - No Magicbricks credentials are stored or required.
 * - Marks portal status as PENDING.
 * - Generates a broker-specific XML feed URL.
 * - Stores selected listings per broker for XML generation.
 */
app.post("/api/portal/magicbricks/initiate", (req, res) => {
  try {
    const { brokerId, listingIds, listings } = req.body;

    if (!brokerId) {
      return res.status(400).json({ error: "brokerId is required" });
    }
    if (!Array.isArray(listingIds) || listingIds.length === 0) {
      return res
        .status(400)
        .json({ error: "At least one listingId is required" });
    }

    // Use listings passed from client (subset of project-linked listings)
    let selectedListings = Array.isArray(listings) ? listings : [];

    // Fallback: if not provided, attempt to resolve from in-memory store
    if (selectedListings.length === 0 && listingsStore.length > 0) {
      selectedListings = listingsStore.filter((l) =>
        listingIds.includes(l.id)
      );
    }

    const safeBrokerId = String(brokerId);
    const xmlFeedUrl = `${req.protocol}://${req.get(
      "host"
    )}/feeds/magicbricks/${encodeURIComponent(safeBrokerId)}.xml`;

    portalConnections.set(safeBrokerId, {
      portal: "magicbricks",
      status: "PENDING",
      brokerId: safeBrokerId,
      xmlFeedUrl,
      listingIds,
    });

    portalListingMap.set(safeBrokerId, selectedListings);

    res.json({
      portal: "magicbricks",
      status: "PENDING",
      brokerId: safeBrokerId,
      xmlFeedUrl,
      selectedListingIds: listingIds,
    });
  } catch (err) {
    console.error("❌ Magicbricks initiate error:", err);
    res.status(500).json({ error: "Failed to initiate Magicbricks connection" });
  }
});

/**
 * Broker-specific Magicbricks XML feed.
 * Path format: GET /feeds/magicbricks/:brokerId.xml
 * - Magicbricks will PULL this feed on their schedule.
 * - XML is generated dynamically per broker from selected listings.
 */
app.get("/feeds/magicbricks/:brokerId.xml", (req, res) => {
  try {
    const brokerId = req.params.brokerId;
    const connection = portalConnections.get(brokerId);

    if (!connection || connection.portal !== "magicbricks") {
      return res.status(404).send("Magicbricks feed not found for this broker.");
    }

    const listings = portalListingMap.get(brokerId) || [];
    const xml = buildMagicbricksXml(brokerId, listings);

    res.set("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (err) {
    console.error("❌ Magicbricks feed error:", err);
    res.status(500).send("Failed to generate Magicbricks XML feed.");
  }
});

/* ===================== START SERVER ===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`POST  /api/leads`);
  console.log(`GET   /api/leads`);
  console.log(`GET   /api/revenue-stats`);
  console.log(`GET   /api/listings`);
  console.log(`POST  /api/listings`);
  console.log(`POST  /api/portal/magicbricks/initiate`);
  console.log(`GET   /feeds/magicbricks/:brokerId.xml`);
});