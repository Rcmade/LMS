import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { useQuery } from "@tanstack/react-query";
import { GetCategoriesT } from "@workspace/types";
import { toast } from "sonner";

const useGetCategories = () => {
  return useQuery<GetCategoriesT["res"]>({
    queryKey: ["category"],
    queryFn: async () => {
      try {
        const response = await api.get("/category");
        return response.data;
      } catch (error) {
        console.error("[GET_ALL_COURSE]", error);
        toast.error(getReadableErrorMessage(error));
      }
    },
  });
};

export default useGetCategories;
