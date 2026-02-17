const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
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

    const response = await axios.post(`${BASE_URL}/Leads`, { fields }, { headers });
    res.status(201).json(response.data);
  } catch (err) {
    console.error("❌ Create Lead Error:", err.response ? err.response.data : err.message);   

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

/* ===================== CREATE CONVERSATION ===================== */
app.post("/api/conversations", async (req, res) => {
  try {
    const { fields } = req.body;

    if (!fields) {
      return res.status(400).json({ error: "Fields are required" });
    }

    const response = await axios.post(`${BASE_URL}/Conversations`, { fields }, { headers });
    res.status(201).json(response.data);
  } catch (err) {
    console.error("❌ Create Conversation Error:", err.response ? err.response.data : err.message);   

    res.status(500).json({ error: "Failed to create conversation" });
  }
});

app.get("/api/leads/segmentation", async (req, res) => {
  try {

    const response = await axios.get(AIRTABLE_URL, {
      headers: {
        Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`
      }
    });

    const leads = response.data.records;

    let hot = 0;
    let warm = 0;
    let cold31to60 = 0;
    let cold0to30 = 0;

    leads.forEach((lead) => {
      const score = lead.fields?.["Lead Score (0–100)"];

      if (!score) return;

      if (score >= 81) hot++;
      else if (score >= 61) warm++;
      else if (score >= 31) cold31to60++;
      else cold0to30++;
    });

    res.json({
      hot,
      warm,
      cold31to60,
      cold0to30
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: "Phone number and message are required",
      });
    }

    console.log("Sending WhatsApp message to:", to);

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "text",
        text: {
          body: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.log("WhatsApp API Error:");
    console.log(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});

/* ===================== START SERVER ===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});