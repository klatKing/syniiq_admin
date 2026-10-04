import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import ThemeToggle from "../components/ThemeToggle";
import ToastContainer from "../components/ui/ToastContainer";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";
import { queryClient } from "./queryClients";
import { router } from "./router";

export default function AppProvider() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ToastContainer />
        </QueryClientProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}