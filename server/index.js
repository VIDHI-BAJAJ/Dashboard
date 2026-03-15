// const express = require("express");
// const axios = require("axios");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();
// const listingRoutes = require("./routes/listingRoutes.js");
// const authRoutes = require("./routes/auth.js");  
// const uploadRoutes  = require("./routes/uploadRoutes.js");  
// // const portalRoutes = require("./routes/portalRoutes.js"); 
// // const listingRoute = require("./routes/listingRoute.js"); 
// const app = express();
// app.use(express.json());
// app.use(
//   cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

 
// // Keep JSON limit small — images go via /api/upload (multipart), NOT json body
// app.use(express.json({ limit: "2mb" }));
// app.use(express.urlencoded({ extended: true, limit: "2mb" }));
 
// // ── Routes ────────────────────────────────────────────────────
// app.use("/api/listings", listingRoutes);
// app.use("/api/auth",     authRoutes);
// app.use("/api/upload",   uploadRoutes);   // ← NEW: handles file uploads
// app.use("/api/files",    uploadRoutes);   // ← NEW: serves files from GridFS

// // ── Connect DB → Start Server ────────────────────────────────────────
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("✅ MongoDB Atlas Connected");
//   } catch (error) {
//     console.error("❌ MongoDB connection failed:", error.message);
//     process.exit(1);
//   }
// };
// connectDB();

// /* ===================== CONFIG ===================== */
// const PORT = process.env.PORT || 5000;
// const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;

// const headers = {
//   Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
//   "Content-Type": "application/json",
// };

// /* ===================== ROOT ===================== */
// app.get("/", (req, res) => {
//   res.send("Backend is live 🚀");
// });

// /* ===================== AIRTABLE FETCH (GENERIC) ===================== */
// const fetchTable = async (tableName) => {
//   let records = [];
//   let offset;

//   do {
//     const response = await axios.get(`${BASE_URL}/${tableName}`, {
//       headers,
//       params: { pageSize: 100, offset },
//     });

//     records.push(...response.data.records);
//     offset = response.data.offset;
//   } while (offset);

//   return records.map((r) => ({
//     id: r.id,
//     fields: r.fields,
//     createdTime: r.createdTime,
//   }));
// };

// /* ===================== GET REVENUE STATS ===================== */
// app.get("/api/revenue-stats", async (req, res) => {
//   try {
//     const leads = await fetchTable("Leads");
//     let totalBudgetMin = 0;
//     let validLeadsCount = 0;
//     leads.forEach(lead => {
//       const budgetMin = lead.fields["Budget (Min)"];
//       if (budgetMin && !isNaN(budgetMin)) {
//         totalBudgetMin += Number(budgetMin);
//         validLeadsCount++;
//       }
//     });
//     const averageBudgetMin = validLeadsCount > 0 ? totalBudgetMin / validLeadsCount : 0;
//     const targetRevenue = 10000000;
//     const achievedRevenue = averageBudgetMin;
//     const percentage = targetRevenue > 0 ? Math.min((achievedRevenue / targetRevenue) * 100, 100) : 0;
//     res.json({ totalBudgetMin, averageBudgetMin, targetRevenue, achievedRevenue, percentage: Math.round(percentage * 10) / 10, validLeadsCount, totalLeadsCount: leads.length });
//   } catch (err) {
//     console.error("❌ Revenue Stats Error:", err);
//     res.status(500).json({ error: "Failed to fetch revenue stats" });
//   }
// });

// /* ===================== GET LEADS ===================== */
// app.get("/api/leads", async (req, res) => {
//   try {
//     const data = await fetchTable("Leads");
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch leads" });
//   }
// });

// /* ===================== GET SINGLE LEAD ===================== */
// app.get("/api/leads/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const response = await axios.get(`${BASE_URL}/Leads/${id}`, { headers });
//     const r = response.data;
//     res.json({ id: r.id, fields: r.fields, createdTime: r.createdTime });
//   } catch (err) {
//     if (err.response?.status === 404) return res.status(404).json({ error: "Lead not found" });
//     res.status(500).json({ error: "Failed to fetch lead" });
//   }
// });

// /* ===================== CREATE LEAD ===================== */
// app.post("/api/leads", async (req, res) => {
//   try {
//     const { fields } = req.body;
//     if (!fields) return res.status(400).json({ error: "Fields are required" });
//     const response = await axios.post(`${BASE_URL}/Leads`, { fields }, { headers });
//     res.status(201).json(response.data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create lead" });
//   }
// });

// /* ===================== OPTIONAL TABLE ROUTES ===================== */
// app.get("/api/tasks", async (req, res) => {
//   try { res.json(await fetchTable("Tasks")); }
//   catch { res.status(500).json({ error: "Failed to fetch Tasks" }); }
// });

// app.get("/api/deals", async (req, res) => {
//   try { res.json(await fetchTable("Deals")); }
//   catch { res.status(500).json({ error: "Failed to fetch Deals" }); }
// });

// app.get("/api/conversations", async (req, res) => {
//   try { res.json(await fetchTable("Conversations")); }
//   catch { res.status(500).json({ error: "Failed to fetch Conversations" }); }
// });

// /* ===================== CREATE CONVERSATION ===================== */
// app.post("/api/conversations", async (req, res) => {
//   try {
//     const { fields } = req.body;
//     if (!fields) return res.status(400).json({ error: "Fields are required" });
//     const response = await axios.post(`${BASE_URL}/Conversations`, { fields }, { headers });
//     res.status(201).json(response.data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create conversation" });
//   }
// });

// /* ===================== WHATSAPP ===================== */
// app.post("/api/send-whatsapp", async (req, res) => {
//   try {
//     const { to, message } = req.body;
//     if (!to || !message) return res.status(400).json({ success: false, error: "Phone number and message are required" });
//     const cleanedNumber = to.replace(/\D/g, "");
//     const response = await axios.post(
//       `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
//       { messaging_product: "whatsapp", to: cleanedNumber, type: "text", text: { body: message } },
//       { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
//     );
//     res.status(200).json({ success: true, data: response.data });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.response?.data || error.message });
//   }
// });


// const portalRoutes = require('./routes/portalRoutes'); // ← ADD
// app.use('/api/portal', portalRoutes);  

// /* ===================== START SERVER ===================== */
// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
// });



const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const listingRoutes = require("./routes/listingRoutes.js");
const authRoutes = require("./routes/auth.js");  
const uploadRoutes  = require("./routes/uploadRoutes.js");  
const portalRoutes = require('./routes/portalRoutes');

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
 
// ── Routes ────────────────────────────────────────────────────
app.use("/api/listings", listingRoutes);
app.use("/api/auth",     authRoutes);
app.use("/api/upload",   uploadRoutes);
app.use("/api/files",    uploadRoutes);
app.use('/api/portal',   portalRoutes);

// ── Connect DB → Start Server ────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas Connected");

    // ── Resume polling if server restarted while status was pending ──
    // This fixes the Render deployment issue where polling stops on restart
    const Portal = require("./models/Portal");
    const { startPolling } = require("./services/reaWatcher");

    const portal = await Portal.findOne({ portalId: "realestate" });
    if (portal?.status === "pending") {
      console.log("⚡ Status was pending — resuming REA email polling...");
      startPolling();
    } else if (portal?.status === "connected") {
      console.log("✅ REA portal already connected — no polling needed");
    } else {
      console.log("ℹ️ REA portal not set up yet");
    }

  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB();

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
    const targetRevenue = 10000000;
    const achievedRevenue = averageBudgetMin;
    const percentage = targetRevenue > 0 ? Math.min((achievedRevenue / targetRevenue) * 100, 100) : 0;
    res.json({ totalBudgetMin, averageBudgetMin, targetRevenue, achievedRevenue, percentage: Math.round(percentage * 10) / 10, validLeadsCount, totalLeadsCount: leads.length });
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

/* ===================== GET SINGLE LEAD ===================== */
app.get("/api/leads/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(`${BASE_URL}/Leads/${id}`, { headers });
    const r = response.data;
    res.json({ id: r.id, fields: r.fields, createdTime: r.createdTime });
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: "Lead not found" });
    res.status(500).json({ error: "Failed to fetch lead" });
  }
});

/* ===================== CREATE LEAD ===================== */
app.post("/api/leads", async (req, res) => {
  try {
    const { fields } = req.body;
    if (!fields) return res.status(400).json({ error: "Fields are required" });
    const response = await axios.post(`${BASE_URL}/Leads`, { fields }, { headers });
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create lead" });
  }
});

/* ===================== OPTIONAL TABLE ROUTES ===================== */
app.get("/api/tasks", async (req, res) => {
  try { res.json(await fetchTable("Tasks")); }
  catch { res.status(500).json({ error: "Failed to fetch Tasks" }); }
});

app.get("/api/deals", async (req, res) => {
  try { res.json(await fetchTable("Deals")); }
  catch { res.status(500).json({ error: "Failed to fetch Deals" }); }
});

app.get("/api/conversations", async (req, res) => {
  try { res.json(await fetchTable("Conversations")); }
  catch { res.status(500).json({ error: "Failed to fetch Conversations" }); }
});

/* ===================== CREATE CONVERSATION ===================== */
app.post("/api/conversations", async (req, res) => {
  try {
    const { fields } = req.body;
    if (!fields) return res.status(400).json({ error: "Fields are required" });
    const response = await axios.post(`${BASE_URL}/Conversations`, { fields }, { headers });
    res.status(201).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

/* ===================== WHATSAPP ===================== */
app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) return res.status(400).json({ success: false, error: "Phone number and message are required" });
    const cleanedNumber = to.replace(/\D/g, "");
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      { messaging_product: "whatsapp", to: cleanedNumber, type: "text", text: { body: message } },
      { headers: { Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`, "Content-Type": "application/json" } }
    );
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data || error.message });
  }
});

/* ===================== START SERVER ===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});