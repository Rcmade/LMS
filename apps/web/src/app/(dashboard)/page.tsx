"use client";
import { IconBadge } from "@/components/badge/IconBadge";
import { InfoCard } from "@/components/card/InfoCard";
import { UserCoursesList } from "@/features/user/course/components/list/CourseList";
import useGetDashboardCourses from "@/features/user/course/hooks/useGetDashboardCourses";
import { CheckCircle, Clock, Info } from "lucide-react";

export default function Dashboard() {
  const { data } = useGetDashboardCourses();

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-x-2 rounded-md border p-3">
          <IconBadge icon={Info} />
          <div>
            <p className="font-medium">Welcome to the dashboard</p>
            <p className="text-sm">
              This is where you can see your progress and continue your courses.
              This is a demonstration LMS and as such, all courses are free.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={data?.coursesInProgress?.length || 0}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={data?.completedCourses?.length || 0}
          variant="success"
        />
      </div>
      <UserCoursesList />
    </div>
  );
}
