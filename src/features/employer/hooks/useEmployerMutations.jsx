import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastContext";
import { getApiError } from "../../login/services/apiError";
import { createEmployee, deleteEmployee, updateEmployee } from "../services/employerService";

function useRefreshEmployees() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["employees"] });
}

export function useCreateEmployee() {
  const refresh = useRefreshEmployees();
  const toast = useToast();
  return useMutation({
    mutationFn: async (body) => (await createEmployee(body)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useUpdateEmployee() {
  const refresh = useRefreshEmployees();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ id, body }) => (await updateEmployee(id, body)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useDeleteEmployee() {
  const refresh = useRefreshEmployees();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id) => (await deleteEmployee(id)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}