"use client";
import DataTable from "@/components/table/DataTable";
import { Button } from "@workspace/ui/components/button";
import { Loader2, PlusCircle } from "lucide-react";
import Link from "next/link";
import useCourseDataTable from "../../hooks/useCourseDataTable";
import useGetAllCourse from "../../hooks/useGetAllCourse";

// interface CourseDataTableProps {
//   data: GetCoursesT["res"];
// }
const CourseDataTable = () => {
  const { data, isLoading } = useGetAllCourse();

  const { columns } = useCourseDataTable();

  return (
    <>
      <Link href="/teacher/courses/create">
        <Button variant="outline" size="sm">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Course
        </Button>
      </Link>

      {isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        <>
          {(data?.length || 0) > 0 ? (
            <DataTable columns={columns} data={data || []} />
          ) : (
            <p>No course found</p>
          )}
        </>
      )}
    </>
  );
};

export default CourseDataTable;
