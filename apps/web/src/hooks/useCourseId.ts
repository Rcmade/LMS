import { useParams } from "next/navigation";

const useCourseId = () => {
  const params = useParams();
  return (params.courseId as string) || null;
};

export default useCourseId;
