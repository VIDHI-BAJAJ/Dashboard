const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

/* ===== Middleware ===== */
app.use(express.json());

app.use(
  cors({
    origin: "*", // ✅ allow Vercel (lock later)
    methods: ["GET"],
  })
);

/* ===== Config ===== */
const PORT = process.env.PORT || 5000;

const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;

const headers = {
  Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
};

/* ===== Root test route ===== */
app.get("/", (req, res) => {
  res.send("Backend is live 🚀");
});

/* ===== Generic Airtable fetch ===== */
const fetchTable = async (tableName) => {
  const res = await axios.get(`${BASE_URL}/${tableName}`, { headers });
  return res.data.records;
};

/* ===== API Routes ===== */

app.get("/api/leads", async (req, res) => {
  try {
    res.json(await fetchTable("Leads"));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Leads" });
  }
});

app.get("/api/conversations", async (req, res) => {
  try {
    res.json(await fetchTable("Conversations"));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Conversations" });
  }
});

app.get("/api/tasks", async (req, res) => {
  try {
    res.json(await fetchTable("Tasks"));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Tasks" });
  }
});

app.get("/api/deals", async (req, res) => {
  try {
    res.json(await fetchTable("Deals"));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Deals" });
  }
});

/* ===== Start Server ===== */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
