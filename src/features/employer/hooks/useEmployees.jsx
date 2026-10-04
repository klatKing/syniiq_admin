import { useQuery } from "@tanstack/react-query";
import { useRealtime } from "../../../hooks/useRealtime";
import { getEmployees } from "../services/employerService";

export function useEmployees() {
  // Rafraîchit la liste quand un employé change (même depuis un autre poste)
  useRealtime("employees", ["employees"]);

  return useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await getEmployees();
      return data.employees; // { success, message, employees: [...] }
    },
  });
}