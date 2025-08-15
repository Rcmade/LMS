import { object, string, union, z } from "zod";

const courseObj = {
  title: string().min(1, {
    message: "Title is required",
  }),
  description: string().min(1, {
    message: "Description is required",
  }),

  categoryId: string().min(1),
  price: z.number(),
} as const;

export const courseKeys = Object.keys(courseObj) as (keyof typeof courseObj)[];

export const createCourseSchema = object({
  title: courseObj.title,
});

export type CreateCourseSchemaT = z.infer<typeof createCourseSchema>;

export const editCourseSchema = object({ ...courseObj });

export type EditCourseSchemaT = z.infer<typeof editCourseSchema>;

export const courseImageSchema = object({
  image: union([
    z.instanceof(File, {
      error: "Image is Required",
    }),
    z
      .string()
      .transform((value) =>
        value === "" ? (undefined as unknown as string) : value
      ),
  ]),
});

export type CourseImageSchemaT = z.infer<typeof courseImageSchema>;
