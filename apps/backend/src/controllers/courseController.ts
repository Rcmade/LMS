import { db } from "@/db/db";
import { getAuth } from "@clerk/express";
import type {
  CreateCourseBackendT,
  EditCourserBackendT,
  GetCourseByIdBackendT,
} from "@workspace/types";
import {
  courseKeys,
  createCourseSchema,
  editCourseSchema,
} from "@workspace/zod-validator";
import type { Request, Response } from "express";
export const createCourse = async (
  req: Request<{}, CreateCourseBackendT["res"], CreateCourseBackendT["req"]>,
  res: Response<CreateCourseBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const body = req.body;
    const parse = createCourseSchema.safeParse(body);
    if (!parse.success) {
      return res.status(400).json({
        error: parse.error.message,
      });
    }

    const course = await db.course.create({
      data: {
        userId,
        title: parse.data.title,
      },
    });

    return res.json(course);
  } catch (error) {
    console.log("[COURSES]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCourseById = async (
  req: Request<GetCourseByIdBackendT["params"]>,
  res: Response<GetCourseByIdBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { courseId } = req.params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          orderBy: {
            position: "asc",
          },
        },
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const categories = await db.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return res.json({
      categories,
      course,
    });
  } catch (error) {
    console.error("[GET_COURSE_BY_ID]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const editCourse = async (
  req: Request<
    EditCourserBackendT["params"],
    EditCourserBackendT["res"],
    EditCourserBackendT["req"]
  >,
  res: Response<EditCourserBackendT["res"]>
) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({
      error: "Unauthorized",
    });
  }
  const { courseId } = req.params;

  const body = req.body;
  let parseBody: Record<string, unknown> = {};

  for (const element of Object.keys(body) as typeof courseKeys) {
    const parse = editCourseSchema
      .pick({
        [element]: true,
      })
      .safeParse({ [element]: body[element] });

    if (!parse.success) {
      return res.status(400).json({
        error: parse.error.message,
      });
    }
    const value = parse.data[element];

    parseBody[element] = value;
  }

  const course = await db.course.update({
    where: {
      id: courseId,
      userId,
    },
    data: parseBody,
  });

  return res.json({
    message: "Your course update successfully!",
    data: course,
  });
};
