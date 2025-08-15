"use client";

import { api, getReadableErrorMessage } from "@/lib/apiUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  CreateChapterApiT,
  GetCourseByIdT,
  ReorderChapterApiT,
} from "@workspace/types";
import { createChapterSchema, type z } from "@workspace/zod-validator";
import type { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type PartialFormProps = {
  initialData: GetCourseByIdT["res"]["course"];
  courseId: string;
};

const useChaptersForm = ({
  courseId,
  // initialData,
  toggleCreating,
}: PartialFormProps & { toggleCreating: () => void }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  type CreateChapterT = z.infer<typeof createChapterSchema>;

  const form = useForm<CreateChapterT>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: { title: "" },
  });
  const { isSubmitting, isValid } = form.formState;

  const { mutate: createChapter, isPending: isCreating } = useMutation<
    CreateChapterApiT["res"],
    unknown,
    CreateChapterT
  >({
    mutationFn: async (values) => {
      const { data } = await api.post<
        CreateChapterApiT["res"],
        AxiosResponse<CreateChapterApiT["res"]>,
        CreateChapterT
      >(`/chapters/c/${courseId}`, values);
      if ("error" in data) throw data;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast.success(data.message);
      toggleCreating();
      router.refresh();
    },
    onError: (error) => toast.error(getReadableErrorMessage(error)),
  });

  const { mutate: reorderChapters } = useMutation<
    ReorderChapterApiT["res"],
    unknown,
    ReorderChapterApiT["req"]
  >({
    mutationFn: async (list) => {
      const { data } = await api.post<
        ReorderChapterApiT["res"],
        AxiosResponse<ReorderChapterApiT["res"]>,
        ReorderChapterApiT["req"]
      >(`/chapters/c/${courseId}/reorder`, list);
      if ("error" in (data || {})) throw data;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
      toast.success(data?.message);
      router.refresh();
    },
    onMutate: () => setIsUpdating(true),
    onError: (error) => toast.error(getReadableErrorMessage(error)),
    onSettled: () => setIsUpdating(false),
  });

  const onSubmit = (values: CreateChapterT) => createChapter(values);

  const onReorder = (list: ReorderChapterApiT["req"]["list"]) =>
    reorderChapters({ list });
  const onEdit = (id: string) =>
    router.push(`/teacher/courses/c/${courseId}/chapters/c/${id}`);

  return {
    form,
    onSubmit,
    onReorder,
    onEdit,
    isUpdating,
    isLoading: isCreating || isSubmitting,
    isValid,
  };
};

export default useChaptersForm;
