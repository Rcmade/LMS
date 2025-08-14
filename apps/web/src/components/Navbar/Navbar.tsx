"use client";

import { UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { Menu, Search } from "lucide-react";
import LogoButton from "../buttons/LogoButton";
import { ThemeButton } from "../buttons/ThemeButton";

const Navbar = () => {
  const { toggleSidebar, open } = useSidebar();

  return (
    <div className="sticky top-0 mb-7 flex w-full items-center justify-between px-2 py-2 backdrop-blur-sm md:px-3 lg:px-4">
      {/* LEFT SIDE */}
      <div className="flex items-center justify-between gap-5">
        <Button onClick={toggleSidebar} size="lg" variant={"ghost"}>
          <Menu />
        </Button>
        <LogoButton
          className={`${open ? "opacity-0 w-0" : ""} transition-all duration-1000`}
        />
        <div className="relative">
          <Input className="pl-10" />
          <div className="pointer-events-non absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="" size={20} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-between gap-5">
        <div className="hidden items-center justify-between gap-5 md:flex">
          <ThemeButton />
          {/* <div className="relative">
            <Bell className="cursor-pointer text-gray-500" size={24} />
            <span className="absolute -right-2 -top-2 inline-flex items-center justify-center rounded-full bg-red-400 px-[0.4rem] py-1 text-xs font-semibold leading-none text-red-100">
              3
            </span>
          </div>
          <hr className="mx-3 h-7 w-0 border border-l border-solid" />
          <div className="flex cursor-pointer items-center gap-3">
            <Image
              src="https://s3-inventorymanagement.s3.us-east-2.amazonaws.com/profile.jpg"
              alt="Profile"
              width={50}
              height={50}
              className="rounded-full h-full object-cover"
            />
            <span className="font-semibold">Ray</span>
          </div> */}
          <UserButton />
        </div>
        {/* <Link href="/settings">
          <Settings className="cursor-pointer text-gray-500" size={24} />
        </Link> */}
      </div>
    </div>
  );
};

export default Navbar;
