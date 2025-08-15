"use client";
import { IconBadge } from "@//components/badge/IconBadge";
import { DescriptionForm } from "@//features/courses/components/form/partialFormSections/DescriptionForm";
import { TitleForm } from "@//features/courses/components/form/partialFormSections/TitleForm";
import { Banner } from "@//features/courses/components/sections/Banner";
import { CourseActions } from "@//features/courses/components/sections/CourseActions";
import useGetCourseById from "@//features/courses/hooks/useGetCourseById";
import useCourseId from "@//hooks/useCourseId";
import { CategoryForm } from "@/features/courses/components/form/partialFormSections/CategoryForm";
import ChaptersForm from "@/features/courses/components/form/partialFormSections/ChaptersForm";
import { ImageForm } from "@/features/courses/components/form/partialFormSections/ImageForm";
import PriceForm from "@/features/courses/components/form/partialFormSections/PriceForm";
import {
  CircleDollarSign,
  LayoutDashboard,
  ListChecks,
  Loader2,
} from "lucide-react";

const CourseIdPage = () => {
  // const { userId } = await auth();
  const courseId = useCourseId();
  const { data, isLoading } = useGetCourseById();

  if (isLoading)
    return (
      <>
        <Loader2 className="animate-spin" />
      </>
    );

  const course = data?.course;
  if (!data || !course) return <>There is not course found with this Id</>;

  const requiredFields = [
    course.title,
    course.description,
    course.image,
    course.price,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];

  const categories = data?.categories || [];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields} / ${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course setup</h1>
            <span className="text-sm">
              Complete all fields {completionText}
            </span>
          </div>
          {courseId && (
            <CourseActions
              disabled={!isComplete}
              courseId={courseId}
              isPublished={course.isPublished}
            />
          )}
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />

            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseIdPage;
