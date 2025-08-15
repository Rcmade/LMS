import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import useChapterId from "@/hooks/useChapterId";
import useCourseId from "@/hooks/useCourseId";
import { useQuery } from "@tanstack/react-query";
import { GetChapterByIdT } from "@workspace/types";
import { toast } from "sonner";

const useGetChapterById = () => {
  //     endPointExample: "/chapters/c/:courseId/c/:chapterId";

  const courseId = useCourseId();
  const chapterId = useChapterId();

  return useQuery<GetChapterByIdT["res"]>({
    queryKey: ["chapter", chapterId],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/chapters/c/${courseId}/c/${chapterId}`,
        );
        return response.data;
      } catch (error) {
        console.error(error);
        toast.error(getReadableErrorMessage(error));
      }
    },
  });
};

export default useGetChapterById;
