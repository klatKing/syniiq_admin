import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const LABEL_TO_PATH = {
  dashboard: "/dashboard",
  offre: "/dashboard/Offre",
  projet: "/dashboard/Projets",
  employer: "/dashboard/Employers",
};

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleSelect = (label) => {
    const path = LABEL_TO_PATH[label];
    if (path) {
      navigate(path);
    } else {
      console.warn(`Aucune route définie pour "${label}"`);
    }
  };

  return (
    <div className="flex h-screen dark:bg-black bg-gray-50 overflow-hidden">
      <Sidebar onSelect={handleSelect} />

      <main className="flex-1 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}