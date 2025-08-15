import { api } from "@/lib/apiUtils";
import { GetPublicCourseByIdApiT } from "@workspace/types";

const getPublicCourseById = async (
  courseId: string,
): Promise<GetPublicCourseByIdApiT["res"]> => {
  try {
    const { data } = await api.get(`/public/c/${courseId}`);
    return data;
  } catch (error) {
    console.error("getPublicCourseById Error", error);
    return null;
  }
};

export default getPublicCourseById;

export type GetPublicCourseByIdResponse = NonNullable<
  Awaited<ReturnType<typeof getPublicCourseById>>
>;
