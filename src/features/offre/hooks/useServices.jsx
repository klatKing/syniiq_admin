import { useQuery } from "@tanstack/react-query";
import { useRealtime } from "../../../hooks/useRealtime";
import { getServices } from "../services/offreService";

export function useServices() {
  // Rafraîchit la liste quand un service change (même depuis un autre poste)
  useRealtime("services", ["services"]);

  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data } = await getServices();
      return data.services; // { success, message, services: [...] }
    },
  });
}