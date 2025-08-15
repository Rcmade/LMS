import {
  createChapter,
  deleteChapter,
  getChapterById,
  publishChapter,
  reorderChapters,
  unpublishChapter,
  updateChapter
} from "@/controllers/chaptersController";
import { Router, type Router as ExpressRouter } from "express";

const chapterRoutes: ExpressRouter = Router();

chapterRoutes.post("/c/:courseId", createChapter);
chapterRoutes.post("/c/:courseId/reorder", reorderChapters);
chapterRoutes.get("/c/:courseId/c/:chapterId", getChapterById);
chapterRoutes.patch("/c/:courseId/c/:chapterId", updateChapter);
chapterRoutes.patch("/c/:courseId/c/:chapterId/publish", publishChapter);
chapterRoutes.patch("/c/:courseId/c/:chapterId/unpublish", unpublishChapter);
chapterRoutes.patch("/c/:courseId/c/:chapterId", deleteChapter);

export default chapterRoutes;
