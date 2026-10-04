import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/authStorage";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const authenticated = isAuthenticated();

  useEffect(() => {
    // Retour arrière du navigateur : la page peut être restaurée depuis le cache
    // sans repasser par React. On revérifie alors la session.
    const handlePageShow = (event) => {
      if (event.persisted && !isAuthenticated()) {
        window.location.href = "/";
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  if (!authenticated) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}