import { api, getReadableErrorMessage } from "@/lib/apiUtils";
import { useMutation } from "@tanstack/react-query";
import { CheckoutCourseApiT } from "@workspace/types";
import { AxiosResponse } from "axios";
import { toast } from "sonner";

type CheckoutRes = CheckoutCourseApiT["res"];
const useCheckoutButton = () => {
  const { mutate, isPending } = useMutation<
    CheckoutRes,
    unknown,
    CheckoutCourseApiT["params"]
  >({
    mutationFn: async ({ courseId }) => {
      const { data } = await api.post<CheckoutRes, AxiosResponse<CheckoutRes>>(
        `/checkout/c/${courseId}`,
        {},
      );
      if ("error" in data) throw data;
      return data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
    onError: (error) => {
      const err = getReadableErrorMessage(error);
      toast.error(err);
    },
  });

  return {
    mutate,
    isLoading: isPending,
  };
};

export default useCheckoutButton;
