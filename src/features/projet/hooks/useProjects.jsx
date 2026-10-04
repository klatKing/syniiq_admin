import { useQuery } from "@tanstack/react-query";
import { useRealtime } from "../../../hooks/useRealtime";
import { getProjects } from "../services/projetService";

export function useProjects() {
  // Rafraîchit la liste quand un projet change (même depuis un autre poste)
  useRealtime("projects", ["projects"]);

  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await getProjects();
      return data.projects; // { success, message, projects: [...] }
    },
  });
}