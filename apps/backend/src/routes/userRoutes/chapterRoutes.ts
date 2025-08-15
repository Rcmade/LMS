import { getChapterInfo } from "@/controllers/userControllers/chapterController";
import { Router, type Router as ExpressRouter } from "express";

const userChaptersRoutes: ExpressRouter = Router();

userChaptersRoutes.get("/c/:courseId/c/:chapterId", getChapterInfo);

export default userChaptersRoutes;
