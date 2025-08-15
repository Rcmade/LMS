import { usePathname } from "next/navigation";

const useIsSearchPage = () => {
  const pathname = usePathname();
  return pathname?.includes("/search");
};

export default useIsSearchPage;
