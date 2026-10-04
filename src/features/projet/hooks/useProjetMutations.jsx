import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../../context/ToastContext";
import { getApiError } from "../../login/services/apiError";
import { createProject, deleteProject, updateProject } from "../services/projetService";

function useRefreshProjects() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["projects"] });
}

export function useCreateProject() {
  const refresh = useRefreshProjects();
  const toast = useToast();
  return useMutation({
    mutationFn: async (body) => (await createProject(body)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useUpdateProject() {
  const refresh = useRefreshProjects();
  const toast = useToast();
  return useMutation({
    mutationFn: async ({ id, body }) => (await updateProject(id, body)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}

export function useDeleteProject() {
  const refresh = useRefreshProjects();
  const toast = useToast();
  return useMutation({
    mutationFn: async (id) => (await deleteProject(id)).data,
    onSuccess: (data) => {
      refresh();
      toast.success(data.message);
    },
    onError: (error) => toast.error(getApiError(error).message),
  });
}