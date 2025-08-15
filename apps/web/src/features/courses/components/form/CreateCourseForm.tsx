"use client";
import useCreateCourseForm from "../../hooks/useCreateCourseForm";

import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import Link from "next/link";

const CreateCourseForm = () => {
  const { form, onSubmit, isLoading, isValid } = useCreateCourseForm();
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course Title</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="e.g. 'Advanced web development'"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                What will you teach in this course?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-x-2">
          <Link href="/teacher/courses">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            spinner={isLoading}
            variant="ghost"
          >
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CreateCourseForm;
