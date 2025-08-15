"use client";

import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditCourseApiT, GetCourseByIdT } from "@workspace/types";
import {
  courseKeys,
  editCourseSchema,
  type EditCourseSchemaT,
  type z,
} from "@workspace/zod-validator";
import type { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";


export type PartialFormProps = {
  initialData: GetCourseByIdT["res"]["course"];
  courseId: string;
};
/**
 * Dynamic, type-safe edit course hook
 * @param updateKey - Which field you want to update (e.g. "title")
 * @param initialData - Existing course data
 */
const useEditCourseForm = <
  K extends (typeof courseKeys)[number], // ensure updateKey is always a valid field
>(
  updateKey: K,
  initialData: GetCourseByIdT["res"]["course"],
  onSuccess?: () => void,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const pickedSchema = editCourseSchema.pick({
    [updateKey]: true,
  });

  type PickedSchemaT = z.infer<typeof pickedSchema>;

  const form = useForm<PickedSchemaT>({
    resolver: zodResolver(pickedSchema),
    defaultValues: ({
      [updateKey]: initialData?.[updateKey] ?? "",
    } as unknown) as PickedSchemaT,
  });
  const { isSubmitting, isValid } = form.formState;

  const { mutate, isPending } = useMutation<
    EditCourseApiT["res"],
    unknown,
    Pick<EditCourseSchemaT, K>
  >({
    mutationFn: async (values) => {
      const { data } = await api.patch<
        EditCourseApiT["res"],
        AxiosResponse<EditCourseApiT["res"]>,
        Pick<EditCourseSchemaT, K>
      >(`/courses/c/${initialData?.id}`, values);

      if ("error" in data) {
        throw data;
      }
      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data?.data?.id] });
      toast.success(data.message);
      onSuccess?.()
      router.refresh();
    },

    onError: (error) => {
      const err = getReadableErrorMessage(error);
      toast.error(err);
    },
  });

  const onSubmit = (values: Pick<EditCourseSchemaT, K>) => {
    mutate(values);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending || isSubmitting,
    isValid,
  };
};

export default useEditCourseForm;
