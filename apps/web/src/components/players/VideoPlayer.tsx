"use client";

import { Lock } from "lucide-react";

interface VideoPlayerProps {
  playbackId?: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
  videoUrl: string;
}

export const VideoPlayer = ({
  // playbackId,
  isLocked,
  // title,
  videoUrl,
}: VideoPlayerProps) => {
  // const [isReady, setIsReady] = useState(false);

  // const onEnd = async () => {
  //   try {
  //     if (completeOnEnd) {
  //       await axios.put(
  //         `/api/courses/${courseId}/chapters/${chapterId}/progress`,
  //         {
  //           isCompleted: true,
  //         },
  //       );

  //       toast.success("Progress updated");
  //       router.refresh();

  //       if (nextChapterId) {
  //         router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
  //       }
  //     }
  //   } catch {
  //     toast.error("Something went wrong");
  //   }
  // };

  return (
    <div className="relative aspect-video">
      {/* {!isReady && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800 dark:bg-slate-200">
          <Loader2 className="text-secondary h-8 w-8 animate-spin" />
        </div>
      )} */}
      {isLocked && (
        <div className="text-secondary absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 dark:bg-slate-200">
          <Lock className="h-8 w-8" />
          <p className="text-sm">This chapter is locked</p>
        </div>
      )}

      {!isLocked && <video src={videoUrl} controls className="aspect-video" />}
      {/* {!isLocked && playbackId && (
        <MuxPlayer
          title={title}
          className={cn(!isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          // onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )} */}
    </div>
  );
};
