import { db } from "@/db/db";
import { getAuth } from "@clerk/express";
import { Attachment, Chapter } from "@prisma/client";
import { GetChapterInfoBackendT } from "@workspace/types";
import { Request, Response } from "express";

export const getChapterInfo = async (
  req: Request<GetChapterInfoBackendT["params"]>,
  res: Response<GetChapterInfoBackendT["res"]>
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const { courseId, chapterId } = req.params;

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      return res.status(404).json({
        chapter: null,
        course: null,
        muxData: null,
        attachments: [],
        nextChapter: null,
        userProgress: null,
        purchase: null,
      });
    }

    let muxData = null;
    let attachments: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId,
        },
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId,
        },
      });

      nextChapter = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: {
            gt: chapter?.position,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    const data = {
      chapter: {
        ...chapter,
        isCompleted: userProgress?.isCompleted,
        videoUrl: chapter.isFree || purchase ? chapter.videoUrl : null,
      },
      course,
      muxData,
      attachments,
      nextChapter,
      userProgress,
      purchase,
    };
    return res.json(data);
  } catch (error) {
    console.error("[GET_CHAPTER]", error);
    return res.status(500).json({
      chapter: null,
      course: null,
      muxData: null,
      attachments: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    });
  }
};
