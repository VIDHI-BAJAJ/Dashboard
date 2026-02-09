const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());

// Logging middleware to debug incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Content-Type: ${req.get('Content-Type')}`);
  next();
});

app.use(
  cors({
    origin: "*", // restrict later in prod
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error", err));
  
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

// ===================== LISTINGS (MongoDB) =====================
const Listing = require('./models/Listing');

// Portal connections removed - no longer using Magicbricks XML feed integration
app.get("/api/listings", async (req, res) => {
  const listings = await Listing.find();
  console.log("DB name:", Listing.db.name);
  console.log("Listings count:", listings.length);
  res.json(listings);
});


app.post("/api/listings", async (req, res) => {
  try {
    const listingData = req.body;
    if (!listingData) return res.status(400).json({ error: "Listing data required" });
    
    // Create new listing document
    const listing = new Listing(listingData);
    
    // Save to database
    const savedListing = await listing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    console.error("❌ Error creating listing:", err.message);
    res.status(500).json({ error: "Failed to create listing" });
  }
});

/* ===================== QUIKR HOMES INTEGRATION ===================== */
const integrationRoutes = require("./routes/integration.routes");
app.use("/api", integrationRoutes);

// Initialize auto-sync service
const { scheduleAutoSync } = require('./services/auto-sync.service');
scheduleAutoSync(30); // Run every 30 minutes

/* ===================== START SERVER ===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`POST  /api/leads`);
  console.log(`GET   /api/leads`);
  console.log(`GET   /api/revenue-stats`);
  console.log(`GET   /api/listings`);
  console.log(`POST  /api/listings`);
  console.log(`POST  /api/integrations/quikr/publish`);
  console.log(`POST  /api/integrations/quikr/publish/:listingId`);
  console.log(`POST  /api/integrations/quikr/sync-pending`);
  console.log('');
  console.log('🔄 Auto-sync service scheduled to run every 30 minutes');
});