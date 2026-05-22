import multer from "multer";

// Use memory storage — files are processed in-memory and never written to disk
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
