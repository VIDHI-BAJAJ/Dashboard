// routes/uploadRoutes.js
const express  = require("express");
const multer   = require("multer");
const { GridFSBucket, ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const router = express.Router();

// Multer — memory storage, stream directly to GridFS
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB per file
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error(`Unsupported file type: ${file.mimetype}`));
  },
});

// Helper: stream buffer → GridFS, returns ObjectId
function uploadToGridFS(bucket, buffer, filename, mimetype) {
  return new Promise((resolve, reject) => {
    const stream = bucket.openUploadStream(filename, { contentType: mimetype });
    stream.on("finish", () => resolve(stream.id));
    stream.on("error", reject);
    stream.end(buffer);
  });
}

// ── POST /api/upload ──────────────────────────────────────────
// Accepts any field name (photos, floorplans, soi, frontPage)
router.post("/", upload.any(), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files received" });
    }

    const db     = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "listings_files" });

    const urls = await Promise.all(
      req.files.map(async (file) => {
        const fileId = await uploadToGridFS(
          bucket,
          file.buffer,
          file.originalname,
          file.mimetype
        );
        return `/api/files/${fileId}`;
      })
    );

    return res.json({ success: true, urls });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// ── GET /api/files/:id — serve file from GridFS ───────────────
// router.get("/files/:id", async (req, res) => {
//   try {
//     const db     = mongoose.connection.db;
//     const bucket = new GridFSBucket(db, { bucketName: "listings_files" });
//     const fileId = new ObjectId(req.params.id);

//     const files = await bucket.find({ _id: fileId }).toArray();
//     if (!files.length) {
//       return res.status(404).json({ success: false, message: "File not found" });
//     }

//     res.set("Content-Type", files[0].contentType || "application/octet-stream");
//     res.set("Cache-Control", "public, max-age=31536000");

//     bucket.openDownloadStream(fileId)
//       .on("error", () => res.status(404).end())
//       .pipe(res);

//   } catch (err) {
//     console.error("File serve error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });

router.get("/:id", getFile);

module.exports = router;