import { useParams } from "next/navigation";

const useChapterId = () => {
  const params = useParams();
  return (params.chapterId as string) || null;
};

export default useChapterId;
