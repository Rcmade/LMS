import { checkoutCourse } from "@/controllers/checkoutController/checkoutController";
import { Router, type Router as ExpressRouter } from "express";

const checkoutRoutes: ExpressRouter = Router();

checkoutRoutes.post("/c/:courseId", checkoutCourse);

export default checkoutRoutes;
