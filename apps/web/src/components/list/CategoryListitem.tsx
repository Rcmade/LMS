"use client";

import { Button } from "@workspace/ui/components/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface CategoryListitemProps {
  label: string;
  value?: string;
}

export const CategoryListitem = ({ label, value }: CategoryListitemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("title");

  const isSelected = currentCategoryId === value;

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    );

    router.push(url);
  };

  return (
    <Button
      onClick={onClick}
      type="button"
      variant={isSelected ? "default" : "ghost"}
    >
      <span className="truncate">{label}</span>
    </Button>
  );
};
