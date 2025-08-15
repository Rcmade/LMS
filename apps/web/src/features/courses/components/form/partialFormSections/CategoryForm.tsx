"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";

import useEditCourseForm, {
  PartialFormProps,
} from "@/features/courses/hooks/useEditCourseForm";
import { Button } from "@workspace/ui/components/button";
import { Combobox } from "@workspace/ui/components/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { cn } from "@workspace/ui/lib/utils";

interface CategoryFormProps extends PartialFormProps {
  options: {
    label: string;
    value: string;
  }[];
}

export const CategoryForm = ({ initialData, options }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const selectedOption = options.find(
    (option) => option.value === initialData?.categoryId,
  );

  const { form, onSubmit, isLoading, isValid } = useEditCourseForm(
    "categoryId",
    initialData,
    toggleEdit,
  );

  return (
        <div className="mt-6 rounded-md border p-4">

      <div className="flex items-center justify-between font-medium">
        Course category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit category
            </>
          )}
        </Button>
      </div>

      {!isEditing && (
        <p className={cn("mt-2 text-sm", !initialData?.categoryId && "italic")}>
          {selectedOption?.label || "No category"}
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      disabled={isLoading}
                      {...field}
                    />
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
