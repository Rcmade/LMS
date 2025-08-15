"use client";

import { Button } from "@workspace/ui/components/button";
import { Trash } from "lucide-react";
import usePublishDeleteCourseButton from "../../hooks/usePublishDeleteCourseButton";

interface CourseActionsProps {
  disabled: boolean;
  courseId: string;
  isPublished: boolean;
}

export const PublishDeleteCourseHandlerButton = ({
  disabled,
  courseId,
  isPublished,
}: CourseActionsProps) => {
  const {
    onPublishToggle,
    onDelete,
    isDeleting,
    isLoading,
    isPublishing,
    isUnPublishing,
  } = usePublishDeleteCourseButton();

  const handlePublishClick = () => {
    onPublishToggle({ isPublished, courseId });
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
        onClick={() => onDelete({ courseId })}
        disabled={disabled || isLoading}
        spinner={isDeleting}
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};
