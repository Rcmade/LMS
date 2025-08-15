import { db } from "@/db/db";
import { GetCategoriesBackendT } from "@workspace/types";
import type { Request, Response } from "express";

export const getCategories = async (
  req: Request,
  res: Response<GetCategoriesBackendT["res"]>
) => {
  try {
    const category = await db.category.findMany({
      take: 10,
    });

    return res.json(category);
  } catch (error) {
    return res.json([]);
  }
};
