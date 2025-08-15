import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import useChapterId from "@/hooks/useChapterId";
import useCourseId from "@/hooks/useCourseId";
import { useQuery } from "@tanstack/react-query";
import { GetChapterInfoByIdApiT } from "@workspace/types";
import { toast } from "sonner";

const useGetChapterDetailedInfo = () => {
  const courseId = useCourseId();
  const chapterId = useChapterId();

  return useQuery<GetChapterInfoByIdApiT["res"]>({
    queryKey: ["user-chapter", chapterId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/chapter/c/${courseId}/c/${chapterId}`,
        );
        return response.data;
      } catch (error) {
        console.error(error);
        toast.error(getReadableErrorMessage(error));
      }
    },
  });
};

export default useGetChapterDetailedInfo;
