/**
 * Extrait le message et les erreurs de champs d'une erreur axios.
 * Format de l'API : { success: false, message, errors: { champ: "message" } }
 */
export function getApiError(error, fallback = "Une erreur est survenue. Réessayez.") {
  if (!error?.response) {
    return {
      message: "Impossible de joindre le serveur. Vérifiez votre connexion.",
      fields: {},
    };
  }
  const data = error.response.data;
  return {
    message: data?.message ?? fallback,
    fields: data?.errors ?? {},
  };
}