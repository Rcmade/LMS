import {
  createCourse,
  deleteCourse,
  editCourse,
  getAllCourse,
  getCourseById,
  publishCourse,
  unpublishCourse,
} from "@/controllers/teacherController/courseController";
import { Router, type Router as ExpressRouter } from "express";

const courseRoutes: ExpressRouter = Router();

courseRoutes.post("/", createCourse);
courseRoutes.get("/c/:courseId", getCourseById);
courseRoutes.get("/", getAllCourse);
courseRoutes.patch("/c/:courseId", editCourse);
courseRoutes.patch("/c/:courseId/publish", publishCourse);
courseRoutes.patch("/c/:courseId/unpublish", unpublishCourse);
courseRoutes.delete("/c/:courseId", deleteCourse);

export default courseRoutes;
