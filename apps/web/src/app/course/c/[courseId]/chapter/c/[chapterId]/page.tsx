"use client";
import { Preview } from "@/components/_richTextEditor/preview";
import { CourseEnrollButton } from "@/components/buttons/CourseEnrollButton";
import { VideoPlayer } from "@/components/players/VideoPlayer";
import useGetChapterDetailedInfo from "@/features/chapters/hooks/useGetChapterDetailedInfo";
import { Banner } from "@/features/courses/components/sections/Banner";
import useChapterId from "@/hooks/useChapterId";
import useCourseId from "@/hooks/useCourseId";
import { Separator } from "@workspace/ui/components/separator";
import { Loader2 } from "lucide-react";

const ChapterIdPage = () => {
  const chapterId = useChapterId();
  const courseId = useCourseId();
  const { data, isLoading } = useGetChapterDetailedInfo();

  if (isLoading) {
    return <Loader2 className="animate-spin" />;
  }

  const chapter = data?.chapter;

  if (!chapter?.id) {
    return <>No chapter found</>;
  }

  const isLocked = !chapter.isFree && !data?.purchase;
  const completeOnEnd = !!data?.purchase && !data?.userProgress?.isCompleted;

  return (
    <div>
      {data?.userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="You need to purchase this course to watch this chapter."
        />
      )}
      <div className="mx-auto flex max-w-4xl flex-col pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={chapterId!}
            title={chapter.title}
            courseId={courseId!}
            nextChapterId={data?.nextChapter?.id}
            playbackId={data?.muxData?.playbackId}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
            videoUrl={chapter.videoUrl!}
          />
        </div>
        <div>
          <div className="flex flex-col items-center justify-between p-4 md:flex-row">
            <h2 className="mb-2 text-2xl font-semibold">{chapter.title}</h2>
            {!data?.purchase && (
              <CourseEnrollButton
                courseId={courseId!}
                price={data?.course?.price || Infinity}
              />
            )}
          </div>
          <Separator />
          <div className="p-4 ">
            <Preview value={chapter.description!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
