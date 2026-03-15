// // routes/uploadRoutes.js
// const express  = require("express");
// const multer   = require("multer");
// const { GridFSBucket, ObjectId } = require("mongodb");
// const mongoose = require("mongoose");

// const router = express.Router();

// // Multer — memory storage, stream directly to GridFS
// const upload = multer({
//   storage: multer.memoryStorage(),
//   limits: { fileSize: 20 * 1024 * 1024 }, // 20MB per file
//   fileFilter: (req, file, cb) => {
//     const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
//     if (allowed.includes(file.mimetype)) cb(null, true);
//     else cb(new Error(`Unsupported file type: ${file.mimetype}`));
//   },
// });

// // Helper: stream buffer → GridFS, returns ObjectId
// function uploadToGridFS(bucket, buffer, filename, mimetype) {
//   return new Promise((resolve, reject) => {
//     const stream = bucket.openUploadStream(filename, { contentType: mimetype });
//     stream.on("finish", () => resolve(stream.id));
//     stream.on("error", reject);
//     stream.end(buffer);
//   });
// }

// // ── POST /api/upload ──────────────────────────────────────────
// // Accepts any field name (photos, floorplans, soi, frontPage)
// router.post("/", upload.any(), async (req, res) => {
//   try {
//     if (!req.files || req.files.length === 0) {
//       return res.status(400).json({ success: false, message: "No files received" });
//     }

//     const db     = mongoose.connection.db;
//     const bucket = new GridFSBucket(db, { bucketName: "listings_files" });

//     const urls = await Promise.all(
//       req.files.map(async (file) => {
//         const fileId = await uploadToGridFS(
//           bucket,
//           file.buffer,
//           file.originalname,
//           file.mimetype
//         );
//         return `/api/files/${fileId}`;
//       })
//     );

//     return res.json({ success: true, urls });
//   } catch (err) {
//     console.error("Upload error:", err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// });


// router.get("/:id", getFile);

// module.exports = router;


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

// ── GET /api/files/:id ────────────────────────────────────────
// Serves a file from GridFS by its ObjectId
// PUBLIC — no auth required (REA needs to fetch images directly)
async function getFile(req, res) {
  try {
    const db     = mongoose.connection.db;
    const bucket = new GridFSBucket(db, { bucketName: "listings_files" });

    // Validate ObjectId
    let fileId;
    try {
      fileId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    // Find file metadata to get content type
    const files = await db
      .collection("listings_files.files")
      .find({ _id: fileId })
      .toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const file = files[0];

    // Set content type header
    res.set("Content-Type", file.contentType || "application/octet-stream");

    // Set cache headers — helps REA fetch images reliably
    res.set("Cache-Control", "public, max-age=31536000");

    // Stream file from GridFS to response
    const downloadStream = bucket.openDownloadStream(fileId);

    downloadStream.on("error", (err) => {
      console.error("GridFS stream error:", err);
      if (!res.headersSent) {
        res.status(500).json({ message: "Error streaming file" });
      }
    });

    downloadStream.pipe(res);

  } catch (err) {
    console.error("getFile error:", err);
    return res.status(500).json({ message: err.message });
  }
}

// ── GET /api/files/:id — PUBLIC, no auth ──────────────────────
router.get("/:id", getFile);

module.exports = router;