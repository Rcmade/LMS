"use client";

import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@workspace/ui/components/form";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";
import { Pencil } from "lucide-react";
import { useState } from "react";
import useEditChapterForm, {
  PartialChapterFormProps,
} from "../../../hooks/useEditChapterForm";

export const ChapterAccessForm = ({ initialData }: PartialChapterFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const { form, onSubmit, isLoading, isValid } = useEditChapterForm(
    "isFree",
    initialData,
    toggleEdit,
  );

  return (
    <div className="mt-6 rounded-md border p-4">
      <div className="flex items-center justify-between font-medium">
        Chapter Access
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit chapter access
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p
          key={`${initialData.isFree}`}
          className={cn("mt-2 text-sm", !initialData?.isFree && "italic")}
        >
          {initialData?.isFree
            ? "This chapter is available for free preview."
            : "This chapter is not free."}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="isFree"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3">
                  <FormControl>
                    <Checkbox
                      id="isFree"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <Label htmlFor="isFree">
                      Check this box if you want to make this chapter free for
                      preview.
                    </Label>
                  </div>
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
