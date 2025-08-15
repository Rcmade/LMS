"use client";

import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateCourseApiT } from "@workspace/types";
import {
  type CreateCourseSchemaT,
  createCourseSchema,
} from "@workspace/zod-validator";
import type { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { toast } from "sonner";

type Res = CreateCourseApiT["res"];
type Req = CreateCourseApiT["req"];
const useCreateCourseForm = () => {
  const router = useRouter();
  const form = useForm<CreateCourseSchemaT>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      title: "",
    },
  });

  const queryClient = useQueryClient();

  const { isSubmitting, isValid } = form.formState;

  const { mutate, isPending } = useMutation<Res, unknown, Req>({
    mutationFn: async (input) => {
      const { data } = await api.post<Res, AxiosResponse<Res>, Req>(
        "/courses",
        input,
      );

      if ("error" in data) {
        throw data;
      }

      return data;
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["courses"],
      });

      if ("data" in data) {
        router.push(`/teacher/courses/c/${data.id}`);
      }
    },
    onError: (error) => {
      const err = getReadableErrorMessage(error);
      toast.error(err);
    },
  });

  const onSubmit = async (values: CreateCourseSchemaT) => {
    mutate(values);
  };

  return {
    form,
    onSubmit,
    isLoading: isPending || isSubmitting,
    isValid,
  };
};

export default useCreateCourseForm;
