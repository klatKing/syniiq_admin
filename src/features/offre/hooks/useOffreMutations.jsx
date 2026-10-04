import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastContext";
import { getApiError } from "../../login/services/apiError";
import { createService, deleteService, updateService } from "../services/offreService";

function useRefreshServices() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["services"] });
}

export function useCreateService() {
  const refresh = useRefreshServices();
  const toast = useToast();
  return useMutation({
    mutationFn: async (body) => (await createService(body)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useUpdateService() {
  const refresh = useRefreshServices();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ id, body }) => (await updateService(id, body)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useDeleteService() {
  const refresh = useRefreshServices();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id) => (await deleteService(id)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}