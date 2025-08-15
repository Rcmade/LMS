import {
  BarChart,
  Compass,
  Layout,
  List
} from "lucide-react";

export const studentRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/search",
  },
] as const;

export const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  }
] as const;

export const sidebarContent = {
  teacherRoutes,
  studentRoutes,
} as const;
