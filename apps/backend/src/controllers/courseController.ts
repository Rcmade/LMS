import { mux } from "@/config/muxConfig";
import { db } from "@/db/db";
import UploadService from "@/services/uploadService";
import { getAuth } from "@clerk/express";
import type {
  CreateCourseBackendT,
  DeleteCourseBackendT,
  EditCourserBackendT,
  GetCourseByIdBackendT,
  PublishCourseBackendT,
  UnPublishCourseBackendT,
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

// /courses/c/:courseId/publish
export const publishCourse = async (
  req: Request<
    PublishCourseBackendT["params"],
    PublishCourseBackendT["res"],
    PublishCourseBackendT["req"]
  >,
  res: Response<PublishCourseBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { courseId } = req.params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({
        error: "Not found",
      });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.image ||
      !course.categoryId ||
      !hasPublishedChapter
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });

    return res.json({
      data: publishedCourse,
      message: "Your course published successfully!",
    });
  } catch (error) {
    console.log("[COURSE_ID_PUBLISH]", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// /courses/c/:courseId/unpublish
export const unpublishCourse = async (
  req: Request<
    UnPublishCourseBackendT["params"],
    UnPublishCourseBackendT["res"],
    UnPublishCourseBackendT["req"]
  >,
  res: Response<UnPublishCourseBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { courseId } = req.params;

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });

    if (!course) {
      return res.status(404).json({
        error: "Not found",
      });
    }

    const unpublishedCourse = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return res.json({
      data: unpublishedCourse,
      message: "Course unpublished successfully!",
    });
  } catch (error) {
    console.log("[COURSE_ID_UNPUBLISH]", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

// /courses/c/:courseId
export const deleteCourse = async (
  req: Request<
    DeleteCourseBackendT["params"],
    DeleteCourseBackendT["res"],
    DeleteCourseBackendT["req"]
  >,
  res: Response<DeleteCourseBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);
    const { courseId } = req.params;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    //  Verify ownership & gather everything we need to clean up
    const course = await db.course.findFirst({
      where: { id: courseId, userId },
      include: {
        attachments: true,
        chapters: {
          include: {
            muxData: true,
            userProgress: true,
          },
        },
        purchases: true,
      },
    });

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    //  Delete Mux assets (if any)
    for (const ch of course.chapters) {
      if (ch.muxData?.assetId) {
        try {
          await mux.video.assets.delete(ch.muxData.assetId);
        } catch (err) {
          // Keep going even if Mux delete fails, but log for visibility
          console.error("[MUX DELETE ASSET]", ch.muxData.assetId, err);
        }
      }
    }

    //  Collect URLs to delete from your storage (image, attachments, chapter videos)
    const urlsToDelete: string[] = [];
    if (course.image) urlsToDelete.push(course.image);
    for (const a of course.attachments) {
      if (a.url) urlsToDelete.push(a.url);
    }
    for (const ch of course.chapters) {
      if (ch.videoUrl) urlsToDelete.push(ch.videoUrl);
    }

    // 4) Best-effort file deletion (non-fatal)
    if (urlsToDelete.length > 0) {
      try {
        await UploadService.deleteFiles(urlsToDelete);
      } catch (err) {
        console.error("[FILE DELETE]", err);
      }
    }

    //  Manual relational cleanup (Mongo doesn't enforce cascading)
    const chapterIds = course.chapters.map((c) => c.id);

    // Delete child tables first
    if (chapterIds.length) {
      await db.userProgress.deleteMany({
        where: { chapterId: { in: chapterIds } },
      });
      await db.muxData.deleteMany({ where: { chapterId: { in: chapterIds } } });
    }
    await db.attachment.deleteMany({ where: { courseId } });
    await db.purchase.deleteMany({ where: { courseId } });
    await db.chapter.deleteMany({ where: { courseId } });

    // Finally delete the course
    await db.course.delete({ where: { id: courseId } });

    return res.json({
      message: "Course and all related resources deleted successfully",
      data: { id: courseId },
    });
  } catch (error) {
    console.error("[COURSE_DELETE]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
