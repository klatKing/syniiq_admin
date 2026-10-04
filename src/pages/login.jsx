import { Navigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import LoginForm from "../features/login/components/LoginForm";
import LoginHero from "../features/login/components/LoginHero";
import { isAuthenticated } from "../services/authStorage";

export default function Login() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <main className="flex h-screen    items-center justify-center bg-gray-100   dark:bg-black">
      <div className="grid w-full h-screen  overflow-hidden  bg-white shadow-xl lg:grid-cols-2 dark:bg-black">
        <section className="relative flex items-center justify-center px-6 py-16 sm:px-12 lg:px-16">
          <ThemeToggle className="absolute right-4 top-4" />
          <LoginForm />
        </section>

        <aside className="hidden p-5 lg:block">
          <LoginHero />
        </aside>
      </div>
    </main>
  );
}