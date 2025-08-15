import Navbar from "@/components/Navbar/Navbar";
import CourseSidebar from "@/features/courses/components/sidebar/CourseSidebar";
import getPublicCourseById from "@/queries/courseQueries/getPublicCourseById";
import { Children, PagePropsPromise } from "@/types";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";

const layout = async ({ children, params }: PagePropsPromise & Children) => {
  // const { userId } = await auth();
  // if (!userId) {
  //   return redirect("/");
  // }
  // const safeProfile = await getSafeProfile();
  // if (!safeProfile) {
  //   return redirect("/");
  // }

  // // const course = await db.course.findUnique({
  // //   where: {
  // //     id: params.courseId,
  // //   },
  // //   include: {
  // //     chapters: {
  // //       where: {
  // //         isPublished: true,
  // //       },
  // //       include: {
  // //         userProgress: {
  // //           where: {
  // //             userId,
  // //           },
  // //         },
  // //       },
  // //       orderBy: {
  // //         position: "asc",
  // //       },
  // //     },
  // //   },
  // // });

  // // if (!course) {
  // //   return redirect("/");
  // // }

  const awaitedParams = await params;
  if (!awaitedParams.courseId) {
    return <>No course found</>;
  }
  const course = await getPublicCourseById(awaitedParams.courseId);

  if (!course) {
    return <>No course found</>;
  }

  // const progressCount: number = await getProgress(userId, course.id);

  return (
    // {/* <div className="h-full">
    //       <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
    //         <CourseNavbar
    //           course={course}
    //           progressCount={progressCount}
    //           currentProfile={safeProfile}
    //         />
    //       </div>
    //       <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
    //         <CourseSidebar
    //           course={course}
    //           progressCount={progressCount}
    //         />
    //       </div>
    //       <main className="md:pl-80 pt-[80px] h-full">
    //         {children}
    //       </main>
    //     </div> */}

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
