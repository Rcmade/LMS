"use client";

import useIsPlayerPage from "@//hooks/useIsPlayerPage";
import useIsTeacher from "@//hooks/useIsTeacher";
import useIsSearchPage from "@/hooks/useIsSearchPage";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { useSidebar } from "@workspace/ui/components/sidebar";
import { LogOut, Menu } from "lucide-react";
import Link from "next/link";
import LogoButton from "../buttons/LogoButton";
import { ThemeButton } from "../buttons/ThemeButton";
import { SearchInput } from "../inputs/SearchInputs";

const Navbar = () => {
  const isTeacherPage = useIsTeacher();
  const isPlayerPage = useIsPlayerPage();
  const isSearchPage = useIsSearchPage();
  const { toggleSidebar, open } = useSidebar();
  const isTeacher = true; //TODO
  return (
    <div className="sticky top-0 mb-7 flex w-full items-center justify-between px-2 py-2 backdrop-blur-sm md:px-3 lg:px-4">
      {/* LEFT SIDE */}
      <div className="flex items-center justify-between gap-5">
        <Button onClick={toggleSidebar} size="icon" variant={"ghost"}>
          <Menu />
        </Button>
        <div className={`&& overflow-hidden ${open && "h-0 w-0"}`}>
          <LogoButton
            className={`${open ? "opacity-0" : ""} transition-all duration-1000`}
          />
        </div>
        {isSearchPage && (
          <div className="hidden md:block">
            <SearchInput />
          </div>
        )}
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
