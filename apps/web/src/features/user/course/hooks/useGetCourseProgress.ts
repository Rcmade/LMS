import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { useQuery } from "@tanstack/react-query";
import { GetUserCourseProgressT } from "@workspace/types";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const useGetCourseProgress = () => {
  const params = useParams();
  return useQuery<GetUserCourseProgressT["res"]>({
    queryKey: ["course-progress", params.courseId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/user/course-progress/c/${params.courseId}`,
        );
        return response.data;
      } catch (error) {
        console.error(error);
        toast.error(getReadableErrorMessage(error));
      }
    },
  });
};

export default useGetCourseProgress;
