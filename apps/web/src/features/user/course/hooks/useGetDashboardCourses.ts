"use client";
import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetDashboardCoursesApiT } from "@workspace/types";
import { toast } from "sonner";

const useGetDashboardCourses = () => {
  return useQuery<GetDashboardCoursesApiT["res"]>({
    queryKey: ["dashboard-courses"],
    queryFn: async () => {
      try {
        const { data } = await api.get<GetDashboardCoursesApiT["res"]>(
          "/user/courses/dashboard",
        );
        return data;
      } catch (error) {
        console.error("[USE_DASHBOARD", error);
        toast.error(getReadableErrorMessage(error));
        throw error;
      }
    },

    placeholderData: keepPreviousData,
  });
};

export default useGetDashboardCourses;
