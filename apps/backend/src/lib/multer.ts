import type { RequestHandler } from "express";
import multer from "multer";

const storage = multer.memoryStorage();

export const uploadSingleImage: RequestHandler = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB limit
  },
}).single("image");

export const uploadSingleVideo: RequestHandler = multer({
  storage,
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("Only video files are allowed!"));
    }
    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 500, // 500 MB limit
  },
}).single("video");