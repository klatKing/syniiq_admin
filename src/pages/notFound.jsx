import { Home, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "../services/authStorage";

export default function NotFound() {
  const authenticated = isAuthenticated();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center dark:bg-black">
      <span className="text-7xl font-extrabold text-green-400">404</span>
      <h1 className="mt-4 text-xl font-semibold text-teal-950 dark:text-white">
        Page introuvable
      </h1>
      <p className="mt-2 max-w-sm text-sm text-teal-950/60 dark:text-white/60">
        La page que vous cherchez n&apos;existe pas ou a été déplacée.
      </p>

      <Link
        to={authenticated ? "/dashboard" : "/"}
        className="mt-8 flex items-center gap-2 rounded-xl bg-green-400 px-5 py-2.5 text-sm font-semibold text-teal-950 transition hover:bg-green-300"
      >
        {authenticated ? (
          <>
            <LayoutDashboard className="h-4 w-4" />
            Retour au tableau de bord
          </>
        ) : (
          <>
            <Home className="h-4 w-4" />
            Retour à la connexion
          </>
        )}
      </Link>
    </div>
  );
}