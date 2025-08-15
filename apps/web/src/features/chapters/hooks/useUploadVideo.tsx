"use client";

import { PartialChapterFormProps } from "@/features/chapters/hooks/useEditChapterForm";
import useChapterId from "@/hooks/useChapterId";
import useCourseId from "@/hooks/useCourseId";
import { api, getReadableErrorMessage } from "@/lib/apiUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UploadChapterVideoApiT } from "@workspace/types";
import {
  chapterVideoSchema,
  ChapterVideoSchemaT,
} from "@workspace/zod-validator";
import type { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type UploadVideoFormT = ChapterVideoSchemaT;

export const useUploadVideo = (
  initialData: PartialChapterFormProps["initialData"],
  onSuccess?: () => void,
) => {
  const courseId = useCourseId();
  const chapterId = useChapterId();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm<UploadVideoFormT>({
    resolver: zodResolver(chapterVideoSchema),
    defaultValues: {
      video: initialData?.videoUrl || undefined,
    },
  });

  const { isSubmitting } = form.formState;

  const { mutate, isPending } = useMutation<
    UploadChapterVideoApiT["res"],
    unknown,
    UploadVideoFormT
  >({
    mutationFn: async (values) => {
      const formData = new FormData();
      formData.append("video", values.video);

      const { data } = await api.post<
        UploadChapterVideoApiT["res"],
        AxiosResponse<UploadChapterVideoApiT["res"]>,
        FormData
      >(`/upload/c/${courseId}/c/${chapterId}/video`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if ("error" in data) {
        throw data;
      }
      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["chapter", chapterId],
      });

      toast.success(data.message);
      onSuccess?.();
      router.refresh();
    },

    onError: (error) => {
      const err = getReadableErrorMessage(error);
      toast.error(err);
    },
  });

  const onSubmit = (values: UploadVideoFormT) => {
    if (!values.video) {
      form.setError("video", {
        message: "Video is required",
      });
      return;
    }
    mutate(values);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending || isSubmitting,
  };
};
