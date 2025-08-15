import { Button } from "@workspace/ui/components/button";
import Link from "next/link";

const page = () => {
  return (
    <div>
      <Button asChild>
        <Link href="/teacher/courses/create">Create Course </Link>
      </Button>
    </div>
  );
};

export default page;
