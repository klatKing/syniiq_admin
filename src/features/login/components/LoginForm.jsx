import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import logo from "../../../assets/syniiq_logo.svg";

const fieldClass =
  "flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-green-400 dark:bg-teal-900/60";
const labelClass =
  "block text-xs font-medium text-teal-950/60 dark:text-green-400";
const inputClass =
  "mt-0.5 block w-full bg-transparent text-sm font-medium text-teal-950 outline-none placeholder:text-teal-950/30 dark:text-white dark:placeholder:text-white/30";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { submitLogin, isLoading, errorMessage, resetError } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin({ email: email.trim(), password });
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <img src={logo} alt="Syniiq Logo" loading="lazy" decoding="async" 
        className="h-15 w-15"/>
        <span className="roboto tracking-wide text-4xl font-black italic  text-green-400 dark:text-white">
          Syniiq 
        </span>
      </div>

      <div className="text-center">
        <h1 className="text-3xl font-bold text-teal-950 dark:text-white">
          Bon retour !
        </h1>

        <p className="mt-2 text-sm text-teal-950/60 dark:text-white/60">
          Connectez-vous pour gérer vos services, projets, équipe et avis.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className={fieldClass}>
          <div className="flex-1">
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="username"
              placeholder="admin@syniiq.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                resetError();
              }}
              className={inputClass}
            />
          </div>
        </div>

        <div className={fieldClass}>
          <div className="flex-1">
            <label htmlFor="password" className={labelClass}>
              Mot de passe
            </label>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                resetError();
              }}
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
            aria-pressed={showPassword}
            className="rounded-md p-1 text-teal-950/50 transition hover:text-teal-950 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 dark:text-white/50 dark:hover:text-green-400"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-400 px-4 py-3 text-sm font-semibold text-teal-950 shadow-sm transition hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 dark:focus-visible:ring-white dark:focus-visible:ring-offset-teal-950"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-teal-950/50 dark:text-white/40">
        Accès réservé à l&apos;administration Syniiq
      </p>
    </div>
  );
}
