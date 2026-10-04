import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-950/10 bg-white text-teal-950 transition hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400 dark:border-white/10 dark:bg-teal-900 dark:text-green-400 dark:hover:bg-teal-800 ${className}`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}