"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";
import LogoButton from "../buttons/LogoButton";
import DashboardSidebarNav from "./DashboardSidebarNav";

const DashboardSidebar = ({
  ...props
}: React.ComponentProps<typeof Sidebar>) => {
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
      <SidebarContent>
        <DashboardSidebarNav />
      </SidebarContent>
      {/* <SidebarFooter><NavUser user={data.user} /></SidebarFooter> */}
    </Sidebar>
  );
};

export default DashboardSidebar;
