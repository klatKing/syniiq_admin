import { useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { setSession } from "../../../services/authStorage";
import { login as loginRequest } from "../services/loginService";

export function useLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  // Retourne sur la page demandée avant la redirection vers /login
  const redirectTo = location.state?.from?.pathname ?? "/dashboard";

  const mutation = useMutation({
    mutationFn: async (credentials) => {
      const { data } = await loginRequest(credentials);
      return data; // { success, message, token, tokenType, expiresIn, user }
    },
    onSuccess: (data) => {
      setSession(data);
      navigate(redirectTo, { replace: true });
    },
  });

  const errorMessage = mutation.error
    ? mutation.error.response?.data?.message ??
      "Impossible de joindre le serveur. Vérifiez votre connexion."
    : null;

  return {
    submitLogin: mutation.mutate,
    isLoading: mutation.isPending ?? mutation.isLoading, // v5 / v4
    errorMessage,
    resetError: mutation.reset,
  };
}