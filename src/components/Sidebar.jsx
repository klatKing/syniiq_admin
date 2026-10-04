import {
  Briefcase,
  Layers2,
  LayoutGrid,
  LogOut,
  Star,
  StepBack,
  StepForward,
  Users,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { resoudreUrlMedia } from "../config/constants";
import { useProfil } from "../features/login/hooks/useProfil";
import { useAuthUser } from "../hooks/useAuthUser";
import ThemeToggle from "./ThemeToggle";
import logo from "../assets/syniiq_logo.svg"

const NAV_ITEMS = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutGrid, end: true },
  { label: "Offres", to: "/dashboard/Offre", icon: Layers2 },
  { label: "Projets", to: "/dashboard/Projets", icon: Briefcase },
  { label: "Employés", to: "/dashboard/Employers", icon: Users },
  { label: "Avis", to: "/dashboard/Avis", icon: Star },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuthUser();
  const { data: user } = useProfil();

  const nom = user?.nom || "Administrateur";
  const email = user?.email || "";
  const photo = resoudreUrlMedia(user?.photoProfil);
  const initiales = nom
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <aside
      className={[
        "flex h-full flex-col justify-between border-r border-gray-200 bg-white px-3 py-4 transition-all duration-300 dark:border-white/10 dark:bg-teal-950",
        collapsed ? "w-20" : "w-64",
      ].join(" ")}
    >
      {/* Logo + navigation */}
      <div>
        <div
          className={[
            "mb-6 flex items-center px-2",
            collapsed ? "flex-col gap-3" : "justify-between",
          ].join(" ")}
        >
          <div className="flex items-center gap-2 overflow-hidden">
             <img src={logo} alt="Syniiq Logo" loading="lazy" decoding="async" 
        className="h-10 w-10"/>
            {!collapsed && (
              <span className=" roboto tracking-wide font-black  whitespace-nowrap text-2xl text-teal-950 dark:text-white">
                Syniiq
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setCollapsed((prev) => !prev)}
            aria-label={collapsed ? "Agrandir le menu" : "Réduire le menu"}
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-teal-950 dark:hover:bg-teal-900 dark:hover:text-green-400"
          >
            {collapsed ? (
              <StepForward className="h-4 w-4" />
            ) : (
              <StepBack className="h-4 w-4" />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  collapsed ? "justify-center" : "",
                  isActive
                    ? "bg-green-400 font-semibold text-teal-950 dark:bg-green-400/15 dark:text-green-400"
                    : "text-teal-950 hover:bg-gray-100 dark:text-white dark:hover:bg-teal-900",
                ].join(" ")
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Thème + profil + déconnexion */}
      <div className="space-y-3">
        <div className={collapsed ? "flex justify-center" : "px-2"}>
          <ThemeToggle />
        </div>

        <div
          className={[
            "flex items-center gap-2.5 rounded-lg border border-gray-200 p-2 dark:border-white/10",
            collapsed ? "flex-col" : "",
          ].join(" ")}
        >
          {photo ? (
            <img
              src={photo}
              alt={nom}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-400 text-xs font-semibold text-teal-950">
              {initiales}
            </div>
          )}

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-teal-950 dark:text-white">
                {nom}
              </p>
              <p className="truncate text-xs text-gray-400">{email}</p>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            aria-label="Se déconnecter"
            title="Se déconnecter"
            className="rounded-md p-1.5 text-red-500 transition hover:bg-red-50 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}