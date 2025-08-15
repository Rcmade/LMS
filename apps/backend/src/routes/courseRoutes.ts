import { createCourse, editCourse, getCourseById } from "@/controllers/courseController";
import { Router, type Router as ExpressRouter } from "express";

const courseRoutes: ExpressRouter = Router();

courseRoutes.post("/", createCourse);
courseRoutes.get("/c/:courseId", getCourseById);
courseRoutes.patch("/c/:courseId", editCourse);

export default courseRoutes;
