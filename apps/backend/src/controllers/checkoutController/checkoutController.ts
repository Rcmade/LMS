import { db } from "@/db/db";
import { getAuth } from "@clerk/express";
import { CheckoutCourseBackendT } from "@workspace/types";
import { Request, Response } from "express";

export const checkoutCourse = async (
  req: Request<CheckoutCourseBackendT["params"]>,
  res: Response
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { courseId } = req.params;

    // Check if course exists and is published
    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if already purchased
    const existingPurchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (existingPurchase) {
      return res.status(400).json({ error: "Course already purchased" });
    }

    // Create the purchase directly (no payment gateway)
    await db.purchase.create({
      data: {
        userId,
        courseId,
      },
    });

    return res.status(200).json({
      message: "Course purchased successfully",
      courseId,
    });
  } catch (error) {
    console.error("[PURCHASE_COURSE]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
