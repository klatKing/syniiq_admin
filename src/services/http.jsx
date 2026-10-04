import axios from "axios";
import { clearSession, getToken } from "./authStorage";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
});

const isLoginRequest = (config) => config?.url?.includes("/auth/login");

// Ajoute le token JWT à chaque requête (sauf au login : un vieux token ferait échouer la connexion)
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !isLoginRequest(config)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Token expiré ou invalide : retour à la page de connexion
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !isLoginRequest(error.config) &&
      window.location.pathname !== "/login"
    ) {
      clearSession();
      window.location.replace("/login");
    }
    return Promise.reject(error);
  }
);

export default http;