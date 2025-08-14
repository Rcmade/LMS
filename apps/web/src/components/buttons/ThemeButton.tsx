"use client";

import { Button } from "@workspace/ui/components/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
export function ThemeButton() {
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => {};
  }, []);

  if (!isMounted) return null;

  return (
    <Button
      onClick={() => setTheme(() => (theme === "dark" ? "light" : "dark"))}
      variant="ghost"
      className={"text-primary"}
      size="lg"
    >
      {theme === "dark" ? <Moon className="" /> : <Sun className="" />}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
