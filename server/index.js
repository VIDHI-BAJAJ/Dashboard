const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(express.json());

app.use(
  cors({
    origin: "*", // lock this later
    methods: ["GET"],
  })
);

/* ================= CONFIG ================= */
const PORT = process.env.PORT || 5000;

const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;

const headers = {
  Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
};

/* ================= ROOT ================= */
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

/* ================= GENERIC FETCH (PAGINATED) ================= */
const fetchTable = async (tableName) => {
  let allRecords = [];
  let offset;

  try {
    do {
      const response = await axios.get(`${BASE_URL}/${tableName}`, {
        headers,
        params: {
          pageSize: 100,
          offset,
          view: "API_ALL",
        },
      });

      const records = response.data.records || [];
      allRecords.push(...records);
      offset = response.data.offset;
    } while (offset);

    // Return dynamic-safe data
    return allRecords.map((record) => ({
      id: record.id,
      fields: record.fields || {},
      createdTime: record.createdTime,
    }));
  } catch (error) {
    console.error(`❌ Airtable error (${tableName}):`, error.message);
    throw error;
  }
};

/* ================= API ROUTES ================= */

app.get("/api/leads", async (req, res) => {
  try {
    const data = await fetchTable("Leads");
    console.log("TOTAL LEADS FETCHED:", data.length); // 👈 add this
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch Leads" });
  }
});


app.get("/api/conversations", async (req, res) => {
  try {
    const data = await fetchTable("Conversations");
    console.log("TOTAL Conversations FETCHED:", data.length); // 👈 add this
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch Conversations" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    const data = await fetchTable("Tasks");
    console.log("TOTAL Tasks FETCHED:", data.length); // 👈 add this
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch Tasks" });
  }
});

app.get("/api/deals", async (req, res) => {
  try {
    const data = await fetchTable("Deals");
    console.log("TOTAL Deals FETCHED:", data.length); // 👈 add this
    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch Deals" });
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
