"use client";

import { IconBadge } from "@/components/badge/IconBadge";
import { PublishDeleteChapterHandlerButton } from "@/features/chapters/components/buttons/PublishDeleteChapterHandlerButton";
import { ChapterAccessForm } from "@/features/chapters/components/form/partialForm/ChapterAccessForm";
import { ChapterDescriptionForm } from "@/features/chapters/components/form/partialForm/ChapterDescriptionForm";
import { ChapterTitleForm } from "@/features/chapters/components/form/partialForm/ChapterTitleForm";
import { VideoForm } from "@/features/chapters/components/form/partialForm/VideoForm";
import useGetChapterById from "@/features/chapters/hooks/useGetChapterById";
import { Banner } from "@/features/courses/components/sections/Banner";
import useChapterId from "@/hooks/useChapterId";
import useCourseId from "@/hooks/useCourseId";
import { ArrowLeft, Eye, LayoutDashboard, Loader2, Video } from "lucide-react";
import Link from "next/link";

const ChapterIdPage = () => {
  const courseId = useCourseId();
  const chapterId = useChapterId();

  const { data: chapter, isLoading } = useGetChapterById();

  if (isLoading)
    return (
      <>
        <Loader2 className="animate-spin" />
      </>
    );

  if (!chapter) return <>There is not chapter found with this Id</>;

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  const initialData = {
    description: chapter.description || "",
    title: chapter.title || "",
    isFree: chapter.isFree || false,
    videoUrl: chapter.videoUrl || "",
  };

  return (
    <>
      <div key={`isPublished-${chapter.isPublished}`}>
        {!chapter.isPublished && (
          <Banner
            variant="warning"
            label="This chapter is unpublished. It will not be visible in the course"
          />
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/c/${courseId}`}
              className="mb-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
              </div>
            </div>
            <span className="text-sm">
              Complete all fields {completionText}
            </span>
          </div>
          {courseId && chapterId && (
            <PublishDeleteChapterHandlerButton
              disabled={!isComplete}
              courseId={courseId}
              chapterId={chapterId}
              isPublished={chapter.isPublished}
            />
          )}
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl font-medium">Customize your chapter</h2>
              </div>
              <ChapterTitleForm initialData={initialData} />
              <ChapterDescriptionForm initialData={initialData} />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl font-medium">Access Settings</h2>
            </div>
            <ChapterAccessForm initialData={initialData} />
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl font-medium">Add a video</h2>
            </div>
            <VideoForm initialData={initialData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChapterIdPage;
