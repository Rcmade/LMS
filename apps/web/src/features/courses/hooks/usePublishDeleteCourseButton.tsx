"use client";

import { useAlertDialog } from "@/hooks/useAlertDialog";
import { api, getReadableErrorMessage } from "@/lib/apiUtils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteCourseApiT, UnPublishCourseApiT } from "@workspace/types";
import type { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// --- Types ---
type PublishRes = UnPublishCourseApiT["res"];
type PublishParams = UnPublishCourseApiT["params"];

type UnpublishRes = UnPublishCourseApiT["res"];
type UnpublishParams = UnPublishCourseApiT["params"];

type DeleteRes = DeleteCourseApiT["res"];
type DeleteParams = DeleteCourseApiT["params"];

const usePublishDeleteCourseButton = () => {
  const { showAlertDialog, setAlertDialogLoading, closeAlertDialog } =
    useAlertDialog();
  const queryClient = useQueryClient();
  const { replace } = useRouter();

  // --- Publish ---
  const { mutate: publishMutate, isPending: isPublishing } = useMutation<
    PublishRes,
    unknown,
    PublishParams
  >({
    mutationFn: async ({ courseId }) => {
      const { data } = await api.patch<PublishRes, AxiosResponse<PublishRes>>(
        `/courses/c/${courseId}/publish`,
        {},
      );
      if ("error" in data) throw data;
      return data;
    },
    onSuccess: (data) => {
      if (data?.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["course", data.data.id] });
      }
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getReadableErrorMessage(error));
    },
  });

  // --- Unpublish ---
  const { mutate: unpublishMutate, isPending: isUnPublishing } = useMutation<
    UnpublishRes,
    unknown,
    UnpublishParams
  >({
    mutationFn: async ({ courseId }) => {
      const { data } = await api.patch<
        UnpublishRes,
        AxiosResponse<UnpublishRes>
      >(`/courses/c/${courseId}/unpublish`, {});
      if ("error" in data) throw data;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["course", data.data.id] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error(getReadableErrorMessage(error));
    },
  });

  // --- Delete ---
  const { mutate: deleteMutate, isPending: isDeleting } = useMutation<
    DeleteRes,
    unknown,
    DeleteParams
  >({
    mutationFn: async ({ courseId }) => {
      setAlertDialogLoading(true);
      const { data } = await api.delete<DeleteRes, AxiosResponse<DeleteRes>>(
        `/courses/c/${courseId}`,
      );
      if ("error" in data) throw data;
      return data;
    },
    onSuccess: (data) => {
      if (data?.data?.id) {
        queryClient.invalidateQueries({ queryKey: ["course", data.data.id] });
      }
      toast.success(data.message);

      setTimeout(() => closeAlertDialog(), 0);
      replace("/");
    },
    onError: (error) => {
      toast.error(getReadableErrorMessage(error));
      setAlertDialogLoading(false);
    },
  });

  // --- Toggle Publish/Unpublish ---
  const onPublishToggle = (
    args: (UnpublishParams | PublishParams) & { isPublished: boolean },
  ) => {
    const { isPublished, courseId } = args;
    if (isPublished) {
      unpublishMutate({ courseId });
    } else {
      publishMutate({ courseId });
    }
  };

  // --- Delete Action ---
  const onDelete = async (args: DeleteParams) => {
    const confirmed = await showAlertDialog({
      title: "Are you sure?",
      description:
        "This action cannot be undone. This will permanently delete this course and all its related data.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (confirmed) {
      deleteMutate(args);
    }
  };

  return {
    onPublishToggle,
    onDelete,
    isLoading: isPublishing || isUnPublishing || isDeleting,
    isPublishing,
    isUnPublishing,
    isDeleting,
  };
};

export default usePublishDeleteCourseButton;
