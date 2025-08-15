import { mux } from "@/config/muxConfig";
import { db } from "@/db/db";
import { getAuth } from "@clerk/express";
import {
  CreateChapterBackendT,
  DeleteChapterBackendT,
  EditChapterBackendT,
  GetChapterByIdBackendT,
  PublishChapterBackendT,
  ReorderChapterBackendT,
  UnPublishChapterBackendT,
} from "@workspace/types";
import {
  createChapterSchema,
  reorderChapterSchema,
} from "@workspace/zod-validator";
import type { Request, Response } from "express";

// POST /chapters/c/:courseId
export const createChapter = async (
  req: Request<
    CreateChapterBackendT["prams"],
    CreateChapterBackendT["res"],
    CreateChapterBackendT["req"]
  >,
  res: Response<CreateChapterBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parse = createChapterSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }

    const { courseId } = req.params;

    // Ensure course belongs to the user
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const lastChapter = await db.chapter.findFirst({
      where: { courseId },
      orderBy: { position: "desc" },
    });

    const newChapter = await db.chapter.create({
      data: {
        title: parse.data.title,
        courseId,
        position: lastChapter ? lastChapter.position + 1 : 1,
      },
    });

    return res.json({
      data: newChapter,
      message: "New Chapter added successfully",
    });
  } catch (error) {
    console.error("[CREATE_CHAPTER]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /chapters/c/:courseId/reorder
export const reorderChapters = async (
  req: Request<
    ReorderChapterBackendT["prams"],
    ReorderChapterBackendT["res"],
    ReorderChapterBackendT["req"]
  >,
  res: Response<ReorderChapterBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const parse = reorderChapterSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: parse.error.message });
    }

    const { courseId } = req.params;

    // Ensure course belongs to the user
    const course = await db.course.findUnique({
      where: { id: courseId, userId },
    });
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Update positions in bulk
    await Promise.all(
      parse.data.list.map(({ id, position }) =>
        db.chapter.update({
          where: { id },
          data: { position },
        })
      )
    );

    // Return updated course object with chapters
    const updatedCourse = await db.course.findUnique({
      where: { id: courseId },
      include: { chapters: true },
    });

    return res.json({ data: updatedCourse, message: "Chapter reordered." });
  } catch (error) {
    console.error("[REORDER_CHAPTERS]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /chapters/c/:courseId/c/:chapterId
export const getChapterById = async (
  req: Request<GetChapterByIdBackendT["params"]>,
  res: Response<GetChapterByIdBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { chapterId, courseId } = req.params;
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      include: {
        muxData: true,
      },
    });

    return res.json(chapter);
  } catch (error) {
    console.log("[Chapter Get]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * DELETE /api/chapters/:chapterId
 */
export const deleteChapter = async (
  req: Request<DeleteChapterBackendT["params"]>,
  res: Response<DeleteChapterBackendT["res"]>
) => {
  try {
    const { chapterId, courseId } = req.params;

    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Ensure the course belongs to the user
    const ownCourse = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true, userId: true },
    });

    if (!ownCourse || ownCourse.userId !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Make sure chapter exists and belongs to course
    const chapter = await db.chapter.findFirst({
      where: { id: chapterId, courseId },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // If the chapter has a video, try to remove Mux asset + related DB entry
    if (chapter.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      if (existingMuxData) {
        try {
          await mux.video.assets.delete(existingMuxData.assetId);
        } catch (err) {
          // Log but continue — asset removal failure shouldn't block DB deletes
          console.error("[Mux Asset Delete]", err);
        }

        // remove muxData record
        try {
          await db.muxData.delete({ where: { id: existingMuxData.id } });
        } catch (err) {
          // Log and continue
          console.error("[DB muxData delete]", err);
        }
      }
    }

    // Delete chapter
    const deletedChapter = await db.chapter.delete({
      where: { id: chapterId },
    });

    // If there are no published chapters left in the course, unpublish the course
    const publishedChaptersInCourse = await db.chapter.findMany({
      where: { courseId, isPublished: true },
      select: { id: true },
      take: 1,
    });

    if (!publishedChaptersInCourse.length) {
      try {
        await db.course.update({
          where: { id: courseId },
          data: { isPublished: false },
        });
      } catch (err) {
        console.error("[COURSE UNPUBLISH]", err);
        // not fatal for the main action — continue
      }
    }

    return res.json({
      message: "Chapter deleted.",
      data: deletedChapter,
    });
  } catch (error) {
    console.error("[CHAPTER_DELETE]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * PATCH /chapters/c/:courseId/c/:chapterId
 */
export const updateChapter = async (
  req: Request<
    EditChapterBackendT["params"],
    EditChapterBackendT["res"],
    EditChapterBackendT["req"]
  >,
  res: Response<EditChapterBackendT["res"]>
) => {
  try {
    const { courseId, chapterId } = req.params;
    const body = req.body || {};

    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const ownCourse = await db.course.findUnique({
      where: { id: courseId },
      select: { id: true, userId: true },
    });

    if (!ownCourse || ownCourse.userId !== userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const updateData = { ...body };

    const chapter = await db.chapter.update({
      where: { id: chapterId },
      data: updateData,
    });

    // If a new videoUrl was provided, manage Mux asset lifecycle
    if (body.videoUrl) {
      const existingMuxData = await db.muxData.findFirst({
        where: { chapterId },
      });

      // delete existing asset if present
      if (existingMuxData) {
        try {
          await mux.video.assets.delete(existingMuxData.assetId);
        } catch (err) {
          console.error("[Mux Asset Delete]", err);
        }

        try {
          await db.muxData.delete({ where: { id: existingMuxData.id } });
        } catch (err) {
          console.error("[DB muxData delete]", err);
        }
      }

      // create new asset in Mux and save metadata
      try {
        const asset = await mux.video.assets.create({
          inputs: [
            {
              url: body.videoUrl,
            },
          ],
          playback_policy: ["public"], // now must be an array
          test: false,
        });

        if (asset) {
          await db.muxData.create({
            data: {
              chapterId,
              assetId: asset.id,
              playbackId: asset.playback_ids?.[0]?.id ?? null,
            },
          });
        }
      } catch (err) {
        console.error("[Mux Asset Create]", err);
      }
    }

    return res.json({ data: chapter, message: "Chapter updated successfully" });
  } catch (error) {
    console.error("[CHAPTER_UPDATE]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /chapters/c/:courseId/c/:chapterId/publish
export const publishChapter = async (
  req: Request<
    PublishChapterBackendT["params"],
    PublishChapterBackendT["res"],
    PublishChapterBackendT["req"]
  >,
  res: Response<PublishChapterBackendT["res"]>
) => {
  try {
    const { courseId, chapterId } = req.params;

    // Clerk authentication
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify that the course belongs to the user
    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch chapter and Mux data
    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId,
      },
    });

    const muxData = await db.muxData.findUnique({
      where: {
        chapterId,
      },
    });

    // Validate required fields before publishing
    if (
      !chapter ||
      !muxData ||
      !chapter.title ||
      !chapter.description ||
      !chapter.videoUrl
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Publish the chapter
    const publishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return res.json({
      message: "Chapter published successfully",
      data: publishedChapter,
    });
  } catch (error) {
    console.error("[CHAPTER_PUBLISH]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /chapters/c/:courseId/c/:chapterId/unpublish
export const unpublishChapter = async (
  req: Request<
    UnPublishChapterBackendT["params"],
    UnPublishChapterBackendT["res"],
    UnPublishChapterBackendT["req"]
  >,
  res: Response<UnPublishChapterBackendT["res"]>
) => {
  try {
    const { courseId, chapterId } = req.params;

    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId,
      },
    });
    if (!ownCourse) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const unpublishedChapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId,
      },
      data: {
        isPublished: false,
      },
    });

    const publishedChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId,
        isPublished: true,
      },
    });

    if (!publishedChaptersInCourse.length) {
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return res.json({
      message: "Chapter unpublished successfully",
      data: unpublishedChapter,
    });
  } catch (error) {
    console.error("[CHAPTER_UNPUBLISH]", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
