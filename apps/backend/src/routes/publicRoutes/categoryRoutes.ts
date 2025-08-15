import { getCategories } from "@/controllers/publicControllers/categoryController";
import { Router, type Router as ExpressRouter } from "express";

const categoryRoutes: ExpressRouter = Router();

categoryRoutes.get("/", getCategories);

export default categoryRoutes;
