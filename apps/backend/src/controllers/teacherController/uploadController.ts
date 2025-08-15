import { mux } from "@/config/muxConfig";
import { db } from "@/db/db";
import UploadService from "@/services/uploadService";
import {
  UploadChapterVideoBackendT,
  UploadCourseImageBackendT,
} from "@workspace/types";
import type { Request, Response } from "express";

export const uploadCourseImage = async (
  req: Request<
    UploadCourseImageBackendT["params"],
    UploadCourseImageBackendT["res"],
    UploadCourseImageBackendT["req"]
  >,
  res: Response<UploadCourseImageBackendT["res"]>
) => {
  try {
    const { courseId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Upload to Cloudinary
    const url = await UploadService.uploadFiles([file]);

    if (!url[0]) {
      return res.status(500).json({
        error: "Failed to upload image",
      });
    }

    const course = await db.course.findFirst({
      where: {
        id: courseId,
      },
      select: {
        id: true,
        image: true,
      },
    });

    if (!course) {
      return res.status(404).json({
        error: "Course not found",
      });
    }

    await db.course.update({
      where: { id: courseId },
      data: { image: url[0] },
    });

    if (course.image) {
      try {
        await UploadService.deleteFiles([course.image]);
      } catch (error) {
        return res.status(403).json({
          error: "Something went wrong",
        });
      }
    }
    return res.json({
      message: "Image uploaded successfully",
      data: { image: url[0] },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Image upload failed" });
  }
};



export const uploadChapterVideo = async (
  req: Request<
    UploadChapterVideoBackendT["params"],
    UploadChapterVideoBackendT["res"],
    UploadChapterVideoBackendT["req"]
  >,
  res: Response<UploadChapterVideoBackendT["res"]>
) => {
  try {
    const { courseId, chapterId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No video file provided" });
    }

    // Max file size check: 100 MB
    const MAX_VIDEO_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_VIDEO_SIZE) {
      return res.status(400).json({ error: "Video must be less than 100 MB" });
    }

    // Upload video to your storage (S3, Cloudinary, etc.)
    const url = await UploadService.uploadFiles([file]);
    if (!url[0]) {
      return res.status(500).json({ error: "Failed to upload video" });
    }

    const chapter = await db.chapter.findFirst({
      where: { id: chapterId, courseId },
      select: { id: true, videoUrl: true },
    });

    if (!chapter) {
      return res.status(404).json({ error: "Chapter not found" });
    }

    // If chapter already has a Mux asset, delete it
    const existingMuxData = await db.muxData.findFirst({
      where: { chapterId },
    });
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

    // Create new Mux asset from the uploaded video
    let muxAssetId: string | null = null;
    let muxPlaybackId: string | null = null;

    try {
      const asset = await mux.video.assets.create({
        inputs: [{ url: url[0] }],
        playback_policy: ["public"], // Array format for latest Mux API
        test: false,
      });

      muxAssetId = asset.id;
      muxPlaybackId = asset.playback_ids?.[0]?.id ?? null;

      await db.muxData.create({
        data: {
          chapterId,
          assetId: muxAssetId,
          playbackId: muxPlaybackId,
        },
      });
    } catch (err) {
      console.error("[Mux Asset Create]", err);
    }

    // Update chapter with video URL
    const updatedChapter = await db.chapter.update({
      where: { id: chapterId },
      data: { videoUrl: url[0] },
    });

    // Delete old video from storage if exists
    if (chapter.videoUrl) {
      try {
        await UploadService.deleteFiles([chapter.videoUrl]);
      } catch (error) {
        console.error("Error deleting old video", error);
      }
    }

    return res.json({
      message: "Video uploaded and processed successfully",
      data: {
        chapter: updatedChapter,
        mux: { assetId: muxAssetId, playbackId: muxPlaybackId },
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Video upload failed" });
  }
};
