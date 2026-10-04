import { useQuery } from "@tanstack/react-query";
import { getUser, isAuthenticated } from "../../../services/authStorage";
import { getMe } from "../services/loginService";

/**
 * Récupère le profil du compte connecté depuis l'API.
 * Le profil enregistré à la connexion s'affiche immédiatement, puis est remplacé
 * par les données à jour du serveur.
 *
 * data = { id, nom, telephone, email, roleSysteme, photoProfil, actif, createdAt }
 */
export function useProfil() {
  return useQuery({
    queryKey: ["profil"],
    queryFn: async () => {
      const { data } = await getMe();
      return data.user;
    },
    enabled: isAuthenticated(),
    placeholderData: getUser() ?? undefined,
    staleTime: 5 * 60 * 1000, // pas de nouvel appel pendant 5 minutes
  });
}