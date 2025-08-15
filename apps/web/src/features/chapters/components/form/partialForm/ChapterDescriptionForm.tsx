"use client";

import { Preview } from "@/components/_richTextEditor/preview";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";
import { Pencil } from "lucide-react";
import { useState } from "react";
import useEditChapterForm, {
  PartialChapterFormProps,
} from "../../../hooks/useEditChapterForm";

export const ChapterDescriptionForm = ({
  initialData,
}: PartialChapterFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const { form, onSubmit, isLoading, isValid } = useEditChapterForm(
    "description",
    initialData,
    toggleEdit,
  );

  return (
    <div className="mt-6 rounded-md border p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter description
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit description
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <div
          key={initialData.description}
          className={cn("mt-2 text-sm", !initialData?.description && "italic")}
        >
          {!initialData?.description && "No description"}
          {initialData?.description && (
            <Preview value={initialData?.description} />
          )}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button
                spinner={isLoading}
                disabled={!isValid || isLoading}
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
