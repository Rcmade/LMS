import { db } from "@/db/db";
import { GetPublicCourseByIdBackendT } from "@workspace/types";
import type { Request, Response } from "express";

export const getCourseById = async (
  req: Request<
    GetPublicCourseByIdBackendT["params"],
    GetPublicCourseByIdBackendT["res"]
  >,
  res: Response<GetPublicCourseByIdBackendT["res"]>
) => {
  try {
    const course = await db.course.findUnique({
      where: {
        id: req.params.courseId,
      },
      include: {
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            title: true,
            description: true,
            isPublished: true,
            courseId: true,
            position: true,
            isFree: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    return res.json(course);
  } catch (error) {
    return res.status(404).json({ error: "Course not found" });
  }
};
