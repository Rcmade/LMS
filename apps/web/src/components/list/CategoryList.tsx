"use client";

import useGetCategories from "@/features/category/hooks/useGetCategories";
import { Loader2 } from "lucide-react";
import { CategoryListitem } from "./CategoryListitem";

export const CategoryList = () => {
  const { data, isLoading } = useGetCategories();
  return (
    <div className="flex items-center gap-x-2 md:mt-0 mt-4 overflow-x-auto pb-2">
      {isLoading && <Loader2 className="animate-spin" />}
      {(data || []).map((item) => (
        <CategoryListitem key={item.name} label={item.name} value={item.id} />
      ))}
    </div>
  );
};
