import {
  uploadChapterVideo,
  uploadCourseImage,
} from "@/controllers/teacherController/uploadController";
import { uploadSingleImage, uploadSingleVideo } from "@/lib/multer";
import { Router, type Router as ExpressRouter } from "express";

const uploadRoutes: ExpressRouter = Router();

uploadRoutes.post("/c/:courseId/image", uploadSingleImage, uploadCourseImage);

uploadRoutes.post(
  "/c/:courseId/c/:chapterId/video",
  uploadSingleVideo,
  uploadChapterVideo
);
export default uploadRoutes;
