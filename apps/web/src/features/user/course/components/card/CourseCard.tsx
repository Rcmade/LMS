import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { IconBadge } from "@/components/badge/IconBadge";
import { formatPrice } from "@/lib/format";
import { GetUserCourseT } from "@workspace/types";
import { CourseProgress } from "../progress/CourseProgress";

export const CourseCard = ({
  id,
  title,
  image,
  price,
  progress,
  category,
  chapters = [],
}: GetUserCourseT["res"][number]) => {
  const chaptersLength = chapters.length;
  return (
    <Link href={`/course/c/${id}`}>
      <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
        {image && (
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image fill className="object-cover" alt={title} src={image} />
          </div>
        )}
        <div className="flex flex-col pt-2">
          <div className="line-clamp-2 text-lg font-medium transition md:text-base">
            {title}
          </div>
          <p className="text-muted-foreground text-xs">{category?.name}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
          </div>
          {progress !== null ? (
            <CourseProgress
              variant={progress === 100 ? "success" : "default"}
              size="sm"
              value={progress}
            />
          ) : (
            <p className="text-md font-medium">{price && formatPrice(price)}</p>
          )}
        </div>
      </div>
    </Link>
  );
};
