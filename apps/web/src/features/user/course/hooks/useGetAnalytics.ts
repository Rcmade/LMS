import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { useQuery } from "@tanstack/react-query";
import { GetTeacherAnalyticsApiT } from "@workspace/types";
import { toast } from "sonner";

const useGetAnalytics = () => {
  return useQuery<GetTeacherAnalyticsApiT["res"]>({
    queryKey: ["analytics"],
    queryFn: async () => {
      try {
        const response = await api.get(`/user/analytics`);
        return response.data;
      } catch (error) {
        console.error(error);
        toast.error(getReadableErrorMessage(error));
      }
    },
  });
};

export default useGetAnalytics;
