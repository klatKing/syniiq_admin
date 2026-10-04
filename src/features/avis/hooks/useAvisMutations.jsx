import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastContext";
import { getApiError } from "../../login/services/apiError";
import { createTestimonial, deleteTestimonial, updateTestimonial } from "../services/avisService";

function useRefreshTestimonials() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["testimonials"] });
}

export function useCreateTestimonial() {
  const refresh = useRefreshTestimonials();
  const toast = useToast();
  return useMutation({
    mutationFn: async (body) => (await createTestimonial(body)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useUpdateTestimonial() {
  const refresh = useRefreshTestimonials();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ id, body }) => (await updateTestimonial(id, body)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useDeleteTestimonial() {
  const refresh = useRefreshTestimonials();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id) => (await deleteTestimonial(id)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}