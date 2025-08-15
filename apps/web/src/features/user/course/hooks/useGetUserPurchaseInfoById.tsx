import { api } from "@//lib/apiUtils";
import { useQuery } from "@tanstack/react-query";
import { GetUserPurchasedCoursesByIdApiT } from "@workspace/types";
import { useParams } from "next/navigation";

const useGetUserPurchaseInfoById = () => {
  const params = useParams();
  return useQuery<GetUserPurchasedCoursesByIdApiT["res"]>({
    queryKey: ["user-course", params.courseId],
    queryFn: async () => {
      try {
        const response = await api.get(`/user/c/${params.courseId}`);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  });
};

export default useGetUserPurchaseInfoById;
