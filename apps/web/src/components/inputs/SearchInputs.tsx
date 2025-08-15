"use client";

import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@workspace/ui/components/input";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import qs from "query-string";
import { useEffect, useState } from "react";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  const searchParams = new URLSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: debouncedValue,
          categoryId: currentCategoryId,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );
    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4" />
      <Input
        onChange={(e) => setValue(e.target.value)}
        value={value}
        className="w-full rounded-full pl-9 md:w-[300px]"
        placeholder="Search for courses"
      />
    </div>
  );
};
