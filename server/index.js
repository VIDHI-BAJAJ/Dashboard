const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const BASE_URL = `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}`;

const headers = {
  Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
};

/* Generic fetch function */
const fetchTable = async (tableName) => {
  const res = await axios.get(`${BASE_URL}/${tableName}`, { headers });
  return res.data.records;
};

/* Leads */
app.get("/api/leads", async (req, res) => {
  try {
    res.json(await fetchTable("Leads"));
  } catch {
    res.status(500).json({ error: "Failed to fetch Leads" });
  }
});

/* Conversations */
app.get("/api/conversations", async (req, res) => {
  try {
    res.json(await fetchTable("Conversations"));
  } catch {
    res.status(500).json({ error: "Failed to fetch Conversations" });
  }
});

/* Tasks */
app.get("/api/tasks", async (req, res) => {
  try {
    res.json(await fetchTable("Tasks"));
  } catch {
    res.status(500).json({ error: "Failed to fetch Tasks" });
  }
});

/* Deals */
app.get("/api/deals", async (req, res) => {
  try {
    res.json(await fetchTable("Deals"));
  } catch {
    res.status(500).json({ error: "Failed to fetch Deals" });
  }
});

app.listen(5000, () =>
  console.log("Server running on http://localhost:5000")
);
