const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://dbUser:Vidhiai@propertycluster.gmiaakl.mongodb.net/propertyDB"
  )
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
