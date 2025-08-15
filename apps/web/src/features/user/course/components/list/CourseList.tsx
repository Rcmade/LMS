"use client";
import { Loader2 } from "lucide-react";
import useGetCourse from "../../hooks/useGetCourse";
import { CourseCard } from "../card/CourseCard";

export const UserCoursesList = () => {
  const { data, isLoading } = useGetCourse();
  if (isLoading)
    return (
      <>
        <Loader2 className="animate-spin" />
      </>
    );
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4">
        {(data || []).map((item) => (
          <CourseCard key={item.id} {...item} />
        ))}
      </div>
      {(data || []).length === 0 && (
        <div className="text-muted-foreground mt-10 text-center text-sm">
          No courses found
        </div>
      )}
    </div>
  );
};
