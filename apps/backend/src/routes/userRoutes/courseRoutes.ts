import {
  getAnalytics,
  getCourseProgress,
  getCourses,
  getDashboardCourses,
  getUserPurchasedCoursesById,
} from "@/controllers/userControllers/courseController";
import { Router, type Router as ExpressRouter } from "express";

const userCourseRoutes: ExpressRouter = Router();

userCourseRoutes.get("/course-progress/c/:courseId", getCourseProgress);
userCourseRoutes.get("/courses", getCourses);
userCourseRoutes.get("/courses/dashboard", getDashboardCourses);
userCourseRoutes.get("/analytics", getAnalytics);
userCourseRoutes.get("/c/:courseId", getUserPurchasedCoursesById);

export default userCourseRoutes;
