"use client";

import { ChaptersListDnd } from "@/components/dnd/ChaptersListDnd";
import useChaptersForm from "@/features/courses/hooks/useChaptersForm";
import { PartialFormProps } from "@/features/courses/hooks/useImageForm";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";

export const ChaptersForm = ({ initialData, courseId }: PartialFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const toggleCreating = () => setIsCreating((prev) => !prev);

  const { form, onSubmit, onReorder, isUpdating, isLoading, isValid, onEdit } =
    useChaptersForm({
      courseId,
      initialData,
      toggleCreating,
    });

  return (
    <div className="relative mt-6 rounded-md border p-4">
      {isUpdating && (
        <div className="rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={!isValid || isLoading}
              spinner={isLoading}
              type="submit"
            >
              Create
            </Button>
          </form>
        </Form>
      )}

      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",
            !initialData?.chapters?.length && "italic",
          )}
        >
          {!initialData?.chapters?.length && "No chapters"}
          <ChaptersListDnd
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData?.chapters || []}
          />
        </div>
      )}

      {!isCreating && (
        <p className="text-muted-foreground mt-4 text-xs">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};

export default ChaptersForm;
