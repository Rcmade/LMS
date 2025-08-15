"use client";
import useEditCourseForm from "@/features/courses/hooks/useEditCourseForm";
import { PartialFormProps } from "@/features/courses/hooks/useImageForm";
import { formatPrice } from "@/lib/format";
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
import { Pencil } from "lucide-react";
import { useState } from "react";

export default function PriceForm({ initialData }: PartialFormProps) {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const { form, onSubmit, isLoading, isValid } = useEditCourseForm(
    "price",
    initialData,
    toggleEdit,
  );
  return (
    <div className="mt-6 rounded-md border p-4">
      <div className="flex items-center justify-between font-medium">
        Course price
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit price
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn("mt-2 text-sm", !initialData?.price && "italic")}>
          {initialData?.price
            ? formatPrice(initialData?.price)
            : "No price set"}
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
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isLoading}
                      placeholder="Set a price for your course"
                      {...field}
                      onChange={(e)=>field.onChange(+e.target.value)}
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
}

export { PriceForm };
