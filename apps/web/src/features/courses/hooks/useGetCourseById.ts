import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { useQuery } from "@tanstack/react-query";
import { GetCourseByIdT } from "@workspace/types";
import { useParams } from "next/navigation";
import { toast } from "sonner";

const useGetCourseById = () => {
  const params = useParams();
  return useQuery<GetCourseByIdT['res']>({
    queryKey: ["course", params.courseId],
    queryFn: async () => {
      try {
        const response = await api.get(`/courses/c/${params.courseId}`);
        return response.data;
      } catch (error) {
        console.error(error);
        toast.error(getReadableErrorMessage(error));
      }
    },
  });
};

export default useGetCourseById;
