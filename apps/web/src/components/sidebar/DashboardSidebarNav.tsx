import { SidebarMenuButton } from "@workspace/ui/components/sidebar";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarContent } from "./SidebarContent";

const DashboardSidebarNav = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2 px-1.5 py-4">
      {sidebarContent.map((item) => (
        <SidebarMenuButton
          key={`top-nav_${item.label}`}
          tooltip={item.label}
          className={cn(
            "hover:!bg-primary/20 hover:!text-primary relative !py-5 font-normal",
            pathname === item.href && "!bg-primary/20 !text-primary !font-bold",
          )}
        >
          {item.icon && <item.icon className="!size-6" />}
          <span>{item.label}</span>
          <Link href={`${item.href}`} className="absolute inset-0"></Link>
        </SidebarMenuButton>
      ))}
    </div>
  );
};

export default DashboardSidebarNav;
