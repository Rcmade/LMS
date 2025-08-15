import DashboardLayout from "@//components/layout/DashboardLayout";
import { Children } from "@//types";

const layout = ({ children }: Children) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

export default layout;
