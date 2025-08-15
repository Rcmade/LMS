import Navbar from "@/components/Navbar/Navbar";
import CourseSidebar from "@/features/courses/components/sidebar/CourseSidebar";
import getPublicCourseById from "@/queries/courseQueries/getPublicCourseById";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ [key: string]: string }>;
}
const layout = async ({ children, params }: LayoutProps) => {
  const awaitedParams = await params;
  if (!awaitedParams.courseId) {
    return <>No course found</>;
  }
  const course = await getPublicCourseById(awaitedParams.courseId);

  if (!course) {
    return <>No course found</>;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <CourseSidebar courseInfo={course} />
      <SidebarInset className="!m-0">
        <Navbar />

        <div className="flex flex-1 flex-col px-2 md:px-3 lg:px-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
