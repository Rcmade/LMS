"use client";

import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import useChapterId from "@/hooks/useChapterId";
import useCourseId from "@/hooks/useCourseId";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditChapterApiT } from "@workspace/types";
import {
  editChapterSchema,
  type EditChapterSchemaT,
  type z,
} from "@workspace/zod-validator";
import type { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export type PartialChapterFormProps = {
  initialData: {
    title: string;
    description: string;
    isFree: boolean;
    videoUrl: string;
  };
};

const useEditChapterForm = <
  K extends keyof PartialChapterFormProps["initialData"],
>(
  updateKey: K,
  initialData: PartialChapterFormProps["initialData"],
  onSuccess?: () => void,
) => {
  // const router = useRouter();
  const queryClient = useQueryClient();

  const courseId = useCourseId();
  const chapterId = useChapterId();

  const pickedSchema = editChapterSchema.pick({
    [updateKey]: true,
  });

  type PickedSchemaT = z.infer<typeof pickedSchema>;

  const form = useForm<PickedSchemaT>({
    resolver: zodResolver(pickedSchema),
    defaultValues: {
      [updateKey]: initialData?.[updateKey],
    } as unknown as PickedSchemaT,
  });
  const { isSubmitting, isValid } = form.formState;

  const { mutate, isPending } = useMutation<
    EditChapterApiT["res"],
    unknown,
    Pick<EditChapterSchemaT, K>
  >({
    mutationFn: async (values) => {
      const { data } = await api.patch<
        EditChapterApiT["res"],
        AxiosResponse<EditChapterApiT["res"]>,
        Pick<EditChapterSchemaT, K>
      >(`/chapters/c/${courseId}/c/${chapterId}`, values);

      if ("error" in data) {
        throw data;
      }
      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["chapter", data?.data?.id] });
      toast.success(data.message);
      onSuccess?.();
    },

    onError: (error) => {
      const err = getReadableErrorMessage(error);
      toast.error(err);
    },
  });

  const onSubmit = (values: Pick<EditChapterSchemaT, K>) => {
    mutate(values);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending || isSubmitting,
    isValid,
  };
};

export default useEditChapterForm;
