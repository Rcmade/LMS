"use client"
import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetUserCourseT } from "@workspace/types";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

const useGetCourse = () => {
  const searchParams = useSearchParams();
  const options = {
    title: searchParams.get("title"),
    categoryId: searchParams.get("categoryId"),
  };

  return useQuery<GetUserCourseT["res"]>({
    queryKey: ["user-courses", options],
    queryFn: async () => {
      try {
        const { data } = await api.get<GetUserCourseT["res"]>("/user/courses", {
          params: {
            title: options?.title,
            categoryId: options?.categoryId,
          },
        });

        return data;
      } catch (error) {
        console.error("[USE_GET_PROGRESS]", error);
        toast.error(getReadableErrorMessage(error));
        throw error;
      }
    },

    placeholderData: keepPreviousData,
  });
};

export default useGetCourse;
