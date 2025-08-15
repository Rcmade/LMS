"use client";

import { MAX_VIDEO_SIZE } from "@/constants";
import { PartialChapterFormProps } from "@/features/chapters/hooks/useEditChapterForm";
import { useUploadVideo } from "@/features/chapters/hooks/useUploadVideo";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField, FormMessage } from "@workspace/ui/components/form";
import { Pencil, VideoIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export const VideoForm = ({ initialData }: PartialChapterFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const { form, isLoading, onSubmit } = useUploadVideo(initialData, toggleEdit);

  const fileInpRef = useRef<HTMLInputElement>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_VIDEO_SIZE) {
      toast.error("File size must be less than 100 MB.");
      if (fileInpRef.current) fileInpRef.current.value = "";
      return;
    }
    if (!file.type.startsWith("video/")) {
      toast.error("Only video files are allowed!");
      return;
    }

    form.setValue("video", file);
  };

  const currentVideoUrl = initialData?.videoUrl || "";

  return (
    <div className="my-4 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit video
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div key={currentVideoUrl} className="mt-4">
          {currentVideoUrl ? (
            <video
              src={currentVideoUrl}
              key={currentVideoUrl}
              controls
              className="w-full max-w-lg rounded-md"
            />
          ) : (
            <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed">
              <VideoIcon className="text-muted-foreground h-10 w-10" />
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-6"
          >
            <FormField
              control={form.control}
              name="video"
              render={({ field }) => {
                const file = field?.value;
                const isFileObject = file instanceof File;
                const fileUrl = isFileObject
                  ? URL.createObjectURL(file)
                  : file || initialData?.videoUrl || "";
                const hasVideo = Boolean(fileUrl);

                return (
                  <>
                    <div className="flex flex-col gap-4">
                      {hasVideo ? (
                        <video
                          src={fileUrl}
                          controls
                          className="w-full max-w-lg rounded-md"
                        />
                      ) : (
                        <div className="flex h-40 w-full items-center justify-center rounded-md border border-dashed">
                          <VideoIcon className="text-muted-foreground h-10 w-10" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="video/*"
                        ref={fileInpRef}
                        hidden
                        disabled={isLoading}
                        onChange={handleVideoChange}
                      />
                      {field.value ? (
                        <Button
                          type="button"
                          disabled={isLoading}
                          variant="destructive"
                          className="w-fit"
                          onClick={() => {
                            field.onChange("");
                            if (fileInpRef.current) {
                              fileInpRef.current.value = "";
                            }
                          }}
                        >
                          Remove Video
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          disabled={isLoading}
                          variant="secondary"
                          className="w-fit"
                          onClick={() => fileInpRef.current?.click()}
                        >
                          Upload Video
                        </Button>
                      )}
                    </div>
                    <FormMessage />
                  </>
                );
              }}
            />
            <Button
              spinner
              disabled={isLoading}
              type="submit"
              className="w-full"
            >
              Save Video
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
