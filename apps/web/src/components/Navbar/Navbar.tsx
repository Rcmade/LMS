"use client";

import useIsPlayerPage from "@//hooks/useIsPlayerPage";
import useIsTeacher from "@//hooks/useIsTeacher";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { LogOut, Menu, Search } from "lucide-react";
import Link from "next/link";
import LogoButton from "../buttons/LogoButton";
import { ThemeButton } from "../buttons/ThemeButton";

const Navbar = () => {
  const isTeacherPage = useIsTeacher();
  const { toggleSidebar, open } = useSidebar();
  const isPlayerPage = useIsPlayerPage();
  const isTeacher = true; //TODO
  return (
    <div className="sticky top-0 mb-7 flex w-full items-center justify-between px-2 py-2 backdrop-blur-sm md:px-3 lg:px-4">
      {/* LEFT SIDE */}
      <div className="flex items-center justify-between gap-5">
        <Button onClick={toggleSidebar} size="icon" variant={"ghost"}>
          <Menu />
        </Button>
        <div className="overflow-hidden">
          <LogoButton
            className={`${open ? "h-0 w-0 opacity-0" : ""} transition-all duration-1000`}
          />
        </div>
        <div className="relative bg-primary-foreground rounded-md">
          <Input className="pl-10 " />
          <div className="pointer-events-non absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="" size={20} />
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-between gap-5">
        <div className="hidden items-center justify-between gap-5 md:flex">
          <ThemeButton />

          {isTeacherPage || isPlayerPage ? (
            <Link href="/">
              <Button size="sm" variant="ghost">
                <LogOut className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </Link>
          ) : isTeacher ? (
            <Link href="/teacher/courses">
              <Button size="sm" variant="ghost">
                Teacher Mode
              </Button>
            </Link>
          ) : null}

          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
