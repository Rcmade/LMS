"use client";

import { Button } from "@workspace/ui/components/button";
import { Trash } from "lucide-react";
import usePublishDeleteChapterButton from "../../hooks/usePublishDeleteChapterButton";

interface ChapterActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  isPublished: boolean;
}

export const PublishDeleteChapterHandlerButton = ({
  disabled,
  courseId,
  chapterId,
  isPublished,
}: ChapterActionsProps) => {
  const {
    onPublishToggle,
    onDelete,
    isDeleting,
    isLoading,
    isPublishing,
    isUnPublishing,
  } = usePublishDeleteChapterButton();

  const handlePublishClick = () => {
    onPublishToggle({ isPublished, courseId, chapterId });
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={handlePublishClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
        spinner={isPublishing || isUnPublishing}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button
        onClick={() => onDelete({ courseId, chapterId })}
        disabled={disabled || isLoading}
        spinner={isDeleting}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
