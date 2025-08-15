import { getCourseById } from "@/controllers/publicControllers/courseController";
import { Router, type Router as ExpressRouter } from "express";

const publicRoutes: ExpressRouter = Router();

publicRoutes.get("/c/:courseId", getCourseById);

export default publicRoutes;
