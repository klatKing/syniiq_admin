import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/login.jsx";
import Dashboard from "../pages/dashboard.jsx";
import Offre from "../pages/offre.jsx";
import Projet from "../pages/projet.jsx";
import Employer from "../pages/employer.jsx";
import Avis from "../pages/avis.jsx";
import NotFound from "../pages/notFound.jsx";

import AdminLayout from "../layout/AdminLayout.jsx";
import RequireAuth from "../config/RequireAuth.jsx";

export const router = createBrowserRouter(
  [
    { path: "/", element: <Login /> },

    {
      path: "/dashboard",
      element: (
        <RequireAuth>
          <AdminLayout />
        </RequireAuth>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "Offre", element: <Offre /> },
        { path: "Projets", element: <Projet /> },
        { path: "Employers", element: <Employer /> },
        { path: "Avis", element: <Avis /> },
      ],
    },
    { path: "*", element: <NotFound /> },
  ],
  { basename: "/" },
);