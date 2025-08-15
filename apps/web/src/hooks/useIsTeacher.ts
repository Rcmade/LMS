import { usePathname } from "next/navigation";

const useIsTeacher = () => {
  const pathname = usePathname();
  return pathname?.startsWith("/teacher");
};

export default useIsTeacher;
