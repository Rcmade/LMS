"use client";

import { PartialFormProps } from "@/features/courses/hooks/useEditCourseForm";
import { useUploadImage } from "@/features/courses/hooks/useImageForm";
import { Avatar, AvatarFallback } from "@workspace/ui/components/avatar";
import { Button } from "@workspace/ui/components/button";
import { Form, FormField, FormMessage } from "@workspace/ui/components/form";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

export const ImageForm = ({ initialData, courseId }: PartialFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const toggleEdit = () => setIsEditing((prev) => !prev);

  const { form, isLoading, onSubmit } = useUploadImage(
    initialData,
    courseId,
    toggleEdit,
  );
  const fileInpRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed!");
      return;
    }

    form.setValue("image", file);
  };

  const currentImage = initialData?.image || "";

  return (
    <div className="my-4 rounded-md p-4">
      <div className="flex items-center justify-between font-medium">
        Course Image
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div key={currentImage} className="mt-4 flex items-center gap-4">
          {currentImage ? (
            <div className="relative size-40 overflow-hidden rounded-md">
              <Image
                src={currentImage}
                alt="Course image"
                fill
                className="object-contain"
              />
            </div>
          ) : (
            <Avatar className="bg-muted flex size-[72px] items-center justify-center rounded-full">
              <AvatarFallback>
                <ImageIcon className="text-muted-foreground size-[36px]" />
              </AvatarFallback>
            </Avatar>
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
              name="image"
              render={({ field }) => {
                const file = field?.value;
                const isFileObject = file instanceof File;
                const fileUrl = isFileObject
                  ? URL.createObjectURL(file)
                  : file || initialData?.image || "";
                const hasImage = Boolean(fileUrl);

                return (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="relative flex size-full items-center gap-x-4 overflow-hidden rounded-md sm:size-56">
                        {hasImage ? (
                          <Image
                            src={fileUrl}
                            alt="Course image"
                            fill
                            className="object-contain"
                          />
                        ) : (
                          <Avatar className="bg-muted flex size-[72px] items-center justify-center rounded-full">
                            <AvatarFallback>
                              <ImageIcon className="text-muted-foreground size-[36px]" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                      <div className="flex flex-col gap-4">
                        <input
                          type="file"
                          accept=".jpg, .jpeg, .png, .svg, .webp"
                          ref={fileInpRef}
                          hidden
                          disabled={isLoading}
                          onChange={handleImageChange}
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
                            Remove Image
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            disabled={isLoading}
                            variant="secondary"
                            className="w-fit"
                            onClick={() => fileInpRef.current?.click()}
                          >
                            Upload Image
                          </Button>
                        )}
                      </div>
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
              Save Image
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};
