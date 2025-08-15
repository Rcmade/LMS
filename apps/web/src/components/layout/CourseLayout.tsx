import { Children } from "@//types";
import {
  SidebarInset,
  SidebarProvider,
} from "@workspace/ui/components/sidebar";
import Navbar from "../Navbar/Navbar";
import DashboardSidebar from "../sidebar/DashboardSidebar";

const CourseLayout = ({ children }: Children) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <DashboardSidebar variant="inset" />
      <SidebarInset className="!m-0">
        <Navbar />
        <div className="flex flex-1 flex-col px-2 md:px-3 lg:px-4">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default CourseLayout;
