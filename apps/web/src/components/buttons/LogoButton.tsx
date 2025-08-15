// import { cn } from "@/lib/utils";
import { cn } from "@workspace/ui/lib/utils";
import Link from "next/link";
import React from "react";

const LogoButton = ({
  className,
  isShortName = false,
  ...rest
}: React.DetailedHTMLProps<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
> & { isShortName?: boolean }) => {
  return (
    <Link
      {...rest}
      href="/"
      className={cn(
        "from-primary to-primary/45 inline-block max-w-full bg-gradient-to-r bg-clip-text text-4xl font-black text-transparent dark:to-purple-700",
        className,
      )}
    >
      {isShortName ? "Garud LMS" : "Garud LMS"}
    </Link>
  );
};

export default LogoButton;
