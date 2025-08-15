import {
  createCourse,
  deleteCourse,
  editCourse,
  getCourseById,
  publishCourse,
  unpublishCourse,
} from "@/controllers/courseController";
import { Router, type Router as ExpressRouter } from "express";

const courseRoutes: ExpressRouter = Router();

courseRoutes.post("/", createCourse);
courseRoutes.get("/c/:courseId", getCourseById);
courseRoutes.patch("/c/:courseId", editCourse);
courseRoutes.patch("/c/:courseId/publish", publishCourse);
courseRoutes.patch("/c/:courseId/unpublish", unpublishCourse);
courseRoutes.patch("/c/:courseId", deleteCourse);

export default courseRoutes;
