const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files inside 'uploads' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`); // Unique filename
  },
});

// Allowed File Types
// const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv"
];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type (${file.mimetype}). Only JPEG, PNG, and JPG are allowed.`), false);
  }
};

// Multer Upload Configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 5MB limit
}).fields([
  { name: "profile_image", maxCount: 1 }, // Single file
  { name: "documents", maxCount: 5 },
  { name: "file", maxCount: 1 } // single files
]);

module.exports = { upload };
