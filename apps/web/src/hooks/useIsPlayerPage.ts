import { usePathname } from "next/navigation";

const useIsPlayerPage = () => {
  const pathname = usePathname();
  return pathname?.includes("/chapters");
};

export default useIsPlayerPage;
