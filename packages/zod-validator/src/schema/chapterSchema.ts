import { array, boolean, number, object, string, union, z } from "zod";

const chapterObj = {
  title: string().min(1, {
    message: "Title is required",
  }),
  description: string().min(1),
  isFree: boolean(),
  videoUrl: string().min(1),
};
export const createChapterSchema = object({
  title: chapterObj.title,
});

export type CreateChapterSchemaT = z.infer<typeof createChapterSchema>;

export const chapterKeys = Object.keys(
  chapterObj
) as (keyof typeof chapterObj)[];

export const editChapterSchema = object({ ...chapterObj });

export type EditChapterSchemaT = z.infer<typeof editChapterSchema>;

export const reorderChapterSchema = object({
  list: array(
    object({
      id: string().min(1),
      position: number().int(),
    })
  ),
});

export type ReorderChapterSchemaT = z.infer<typeof reorderChapterSchema>;

export const chapterVideoSchema = object({
  video: union([
    z.instanceof(File, {
      error: "Video is Required",
    }),
    z
      .string()
      .transform((value) =>
        value === "" ? (undefined as unknown as string) : value
      ),
  ]),
});

export type ChapterVideoSchemaT = z.infer<typeof chapterVideoSchema>;
