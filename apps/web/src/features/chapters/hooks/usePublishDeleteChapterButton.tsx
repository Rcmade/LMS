"use client";

import { api, getReadableErrorMessage } from "@//lib/apiUtils";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  DeleteChapterApiT,
  PublishChapterApiT,
  UnPublishChapterApiT,
} from "@workspace/types";
import type { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type PublishRes = PublishChapterApiT["res"];
type PublishParams = PublishChapterApiT["params"];

type UnpublishRes = UnPublishChapterApiT["res"];
type UnpublishParams = UnPublishChapterApiT["params"];

type DeleteRes = DeleteChapterApiT["res"];
type DeleteParams = DeleteChapterApiT["params"];

const usePublishDeleteChapterButton = () => {
  const { showAlertDialog, setAlertDialogLoading, closeAlertDialog } =
    useAlertDialog();
  const queryClient = useQueryClient();
  const router = useRouter();
  // --- Publish ---
  const { mutate: publishMutate, isPending: isPublishing } = useMutation<
    PublishRes,
    unknown,
    PublishParams
  >({
    mutationFn: async (params) => {
      const { courseId, chapterId } = params;
      const { data } = await api.patch<PublishRes, AxiosResponse<PublishRes>>(
        `/chapters/c/${courseId}/c/${chapterId}/publish`,
        {},
      );
      if ("error" in data) throw data;
      return data;
    },
    onSuccess: (data) => {
      // invalidate course + chapter caches as needed
      const chapterId = data?.data?.id;
      if (chapterId) {
        queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
        queryClient.invalidateQueries({
          queryKey: ["course", data?.data?.courseId],
        });
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
    mutationFn: async (params) => {
      const { courseId, chapterId } = params;
      const { data } = await api.patch<
        UnpublishRes,
        AxiosResponse<UnpublishRes>
      >(`/chapters/c/${courseId}/c/${chapterId}/unpublish`, {});
      if ("error" in data) throw data;
      return data;
    },
    onSuccess: (data) => {
      const chapterId = data?.data?.id;
      if (chapterId) {
        queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
        queryClient.invalidateQueries({
          queryKey: ["course", data?.data?.courseId],
        });
      }
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
    mutationFn: async (params) => {
      setAlertDialogLoading(true);
      const { chapterId, courseId } = params;

      const path = `/chapters/c/${courseId}/c/${chapterId}`;

      const { data } = await api.delete<DeleteRes, AxiosResponse<DeleteRes>>(
        path,
      );
      if ("error" in data) throw data;
      return data;
    },
    onSuccess: (data) => {
      const chapterId = data?.data?.id;
      if (chapterId) {
        queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });
        queryClient.invalidateQueries({
          queryKey: ["course", data?.data?.courseId],
        });
      }
      router.back();
      toast.success(data.message);
      setTimeout(() => closeAlertDialog(), 0);
    },
    onError: (error) => {
      toast.error(getReadableErrorMessage(error));
      setAlertDialogLoading(false);
    },
  });

  const onPublishToggle = (
    args: (UnpublishParams | PublishParams) & { isPublished: boolean },
  ) => {
    const { isPublished, courseId, chapterId } = args;
    if (isPublished) {
      unpublishMutate({ courseId, chapterId });
    } else {
      publishMutate({ courseId, chapterId });
    }
  };

  const onDelete = async (args: DeleteParams) => {
    const confirmed = await showAlertDialog({
      title: "Are you sure?",
      description:
        "This action cannot be undone. This will permanently delete this chapter.",
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

export default usePublishDeleteChapterButton;
