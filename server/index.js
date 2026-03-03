const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const listingRoutes = require("./routes/listingRoutes.jsx");


const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*", // restrict later in prod
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// 50mb limit to handle base64 photo payloads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ── Routes ─────────────────────────────────────────────────────────
app.use("/api/listings", listingRoutes);



// ── Connect DB → Start Server ──────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Atlas Connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};
connectDB()

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

// app.post("/api/send-whatsapp", async (req, res) => {
//   try {
//     const { to, message } = req.body;

//     if (!to || !message) {
//       return res.status(400).json({
//         success: false,
//         error: "Phone number and message are required",
//       });
//     }

//     console.log("Sending WhatsApp message to:", to);

//     const response = await axios.post(
//       `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
//       {
//         messaging_product: "whatsapp",
//         to: to,
//         type: "text",
//         text: {
//           body: message,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     res.status(200).json({
//       success: true,
//       data: response.data,
//     });

//   } catch (error) {
//     console.log("WhatsApp API Error:");
//     console.log(error.response?.data || error.message);

//     res.status(500).json({
//       success: false,
//       error: error.response?.data || error.message,
//     });
//   }
// });

app.post("/api/send-whatsapp", async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        error: "Phone number and message are required",
      });
    }

    // ✅ Clean phone number (remove +, spaces, dashes)
    const cleanedNumber = to.replace(/\D/g, "");

    console.log("📤 Sending WhatsApp message to:", cleanedNumber);
    console.log("📱 PHONE_NUMBER_ID:", process.env.PHONE_NUMBER_ID ? "Loaded ✅" : "Missing ❌");
    console.log("🔑 WHATSAPP_TOKEN:", process.env.WHATSAPP_TOKEN ? "Loaded ✅" : "Missing ❌");

    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${process.env.PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: cleanedNumber,
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

    console.log("✅ WhatsApp API Success:", response.data);

    res.status(200).json({
      success: true,
      data: response.data,
    });

  } catch (error) {
    console.log("❌ WhatsApp API Error:");
    console.log(JSON.stringify(error.response?.data, null, 2));

    res.status(500).json({
      success: false,
      error: error.response?.data || error.message,
    });
  }
});


// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

/* ===================== AI INSIGHT ===================== */
app.post("/api/ai-insight", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // 🔹 Extract lead name (simple version)
    const match = message.match(/about (.+)/i);
    const leadName = match ? match[1] : null;

    if (!leadName) {
      return res.json({ reply: "Please specify a lead name." });
    }

    // 🔹 Fetch all tables (using your existing function)
    const leads = await fetchTable("Leads");
    const conversations = await fetchTable("Conversations");
    const tasks = await fetchTable("Tasks");
    const deals = await fetchTable("Deals");

    // 🔹 Find Lead
    const lead = leads.find(
      (l) =>
        l.fields?.Name?.toLowerCase() === leadName.toLowerCase()
    );

    if (!lead) {
      return res.json({ reply: "Lead not found." });
    }

    const leadId = lead.id;

    // 🔹 Filter related records
    const relatedConversations = conversations.filter((c) =>
      c.fields?.Lead?.includes(leadId)
    );

    const relatedTasks = tasks.filter((t) =>
      t.fields?.Lead?.includes(leadId)
    );

    const relatedDeals = deals.filter((d) =>
      d.fields?.Lead?.includes(leadId)
    );

    const crmData = {
      lead: lead.fields,
      conversations: relatedConversations.map(c => c.fields),
      tasks: relatedTasks.map(t => t.fields),
      deals: relatedDeals.map(d => d.fields),
    };

    // 🔹 Send to OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI Sales Intelligence Assistant.",
        },
        {
          role: "user",
          content: `
User Question:
${message}

CRM Data:
${JSON.stringify(crmData, null, 2)}

Provide:
1. Full summary
2. Risk analysis
3. Conversion probability
4. Suggested next action
5. Revenue potential
          `,
        },
      ],
    });

    res.json({
      reply: completion.choices[0].message.content,
    });

  } catch (error) {
    console.error("AI Insight Error:", error);
    res.status(500).json({ error: "Failed to generate AI insight" });
  }
});
/* ===================== START SERVER ===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});