"use client";
import LogoButton from "@/components/buttons/LogoButton";
import useGetUserPurchaseInfoById from "@/features/user/course/hooks/useGetUserPurchaseInfoById";
import { GetPublicCourseByIdResponse } from "@/queries/courseQueries/getPublicCourseById";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import { Lock, LockOpen } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const CourseSidebar = ({
  courseInfo,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  courseInfo: GetPublicCourseByIdResponse;
}) => {
  const pathname = usePathname();
  const { data } = useGetUserPurchaseInfoById();
  const { replace } = useRouter();
  useEffect(() => {
    if (
      pathname === `/course/c/${courseInfo.id}` &&
      courseInfo.chapters &&
      courseInfo.chapters.length > 0
    ) {
      replace(
        `/course/c/${courseInfo.id}/chapter/c/${courseInfo.chapters?.[0]?.id}`,
      );
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-transparent data-[slot=sidebar-menu-button]:!p-1.5">
              <LogoButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="my-4">
        {(courseInfo.chapters || []).map((item) => {
          const link = `/course/c/${courseInfo.id}/chapter/c/${item.id}`;
          return (
            <SidebarMenuButton
              key={`course-nav_${item.id}`}
              tooltip={item.title}
              className={cn(
                "hover:!bg-primary/20 hover:!text-primary relative !py-5 font-normal",
                pathname === link && "!bg-primary/20 !text-primary !font-bold",
              )}
            >
              {item.isFree || data?.purchase?.id ? (
                <LockOpen />
              ) : (
                <Lock className="!size-6" />
              )}
              <span>{item.title}</span>
              <Link href={link} className="absolute inset-0"></Link>
            </SidebarMenuButton>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};

export default CourseSidebar;
