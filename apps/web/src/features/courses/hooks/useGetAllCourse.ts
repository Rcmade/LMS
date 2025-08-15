import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { useQuery } from "@tanstack/react-query";
import { GetCoursesT } from "@workspace/types";
import { toast } from "sonner";

const useGetAllCourse = () => {
  return useQuery<GetCoursesT["res"]>({
    queryKey: ["courses"],
    queryFn: async () => {
      try {
        const response = await api.get("/courses");
        return response.data;
      } catch (error) {
        console.error("[GET_ALL_COURSE]", error);
        toast.error(getReadableErrorMessage(error));
      }
    },
  });
};

export default useGetAllCourse;
