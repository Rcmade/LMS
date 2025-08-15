"use client";

import { api, getReadableErrorMessage } from "@/lib/apiUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { GetCourseByIdT, UploadCourseImageApiT } from "@workspace/types";
import {
  courseImageSchema,
  CourseImageSchemaT,
} from "@workspace/zod-validator";
import type { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

// Props from your PartialFormProps
export type PartialFormProps = {
  initialData: GetCourseByIdT["res"]["course"];
  courseId: string;
};

export type UploadImageFormT = CourseImageSchemaT;

export const useUploadImage = (
  initialData: GetCourseByIdT["res"]["course"],
  courseId: string,
  onSuccess?: () => void,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<UploadImageFormT>({
    resolver: zodResolver(courseImageSchema),
    defaultValues: {
      image: initialData?.image || undefined, // start empty
    },
  });

  const { isSubmitting } = form.formState;

  const { mutate, isPending } = useMutation<
    UploadCourseImageApiT["res"],
    unknown,
    UploadImageFormT
  >({
    mutationFn: async (values) => {
      const formData = new FormData();
      formData.append("image", values.image);

      const { data } = await api.post<
        UploadCourseImageApiT["res"],
        AxiosResponse<UploadCourseImageApiT["res"]>,
        FormData
      >(`/upload/c/${courseId}/image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if ("error" in data) {
        throw data;
      }
      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });

      toast.success(data.message);
      onSuccess?.();
      router.refresh();
    },

    onError: (error) => {
      const err = getReadableErrorMessage(error);
      toast.error(err);
    },
  });

  const onSubmit = (values: UploadImageFormT) => {
    if (!values.image) {
      form.setError("image", {
        message: "Image is Required",
      });
    }
    mutate(values);
  };

  console.log({ err: form.formState.errors });
  return {
    form,
    onSubmit,
    isLoading: isPending || isSubmitting,
  };
};
