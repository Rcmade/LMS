"use client";

import useCheckoutButton from "@/features/checkout/hooks/useCheckoutButton";
import { formatPrice } from "@/lib/format";
import { Button } from "@workspace/ui/components/button";

interface CourseEnrollButtonProps {
  price: number;
  courseId: string;
}

export const CourseEnrollButton = ({
  price,
  courseId,
}: CourseEnrollButtonProps) => {
  const { isLoading, mutate } = useCheckoutButton();

  return (
    <Button
      onClick={() => {
        mutate({
          courseId,
        });
      }}
      disabled={isLoading}
      spinner
      size="sm"
      className="w-full md:w-auto"
    >
      Enroll for {formatPrice(price)}
    </Button>
  );
};
