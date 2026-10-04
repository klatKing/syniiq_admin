import { CheckCircle2, X, XCircle } from "lucide-react";
import { useToastList } from "../../context/ToastContext";

export default function ToastContainer() {
  const { toasts, remove } = useToastList();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-200 flex w-full flex-col items-center gap-2 px-4">
      {toasts.map((t) => {
        const isSuccess = t.type === "success";
        return (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto relative flex w-full max-w-3xl items-center justify-center gap-3 rounded-xl border p-4 shadow-lg ${
              isSuccess
                ? "border-green-200 bg-white dark:border-green-400/20 dark:bg-teal-950"
                : "border-red-200 bg-white dark:border-red-400/20 dark:bg-teal-950"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 shrink-0 text-red-500" />
            )}
            <p className="text-center text-sm font-medium text-teal-950 dark:text-white">
              {t.message}
            </p>
            <button
              type="button"
              onClick={() => remove(t.id)}
              aria-label="Fermer"
              className="absolute right-3 rounded-md p-0.5 text-gray-400 transition hover:text-teal-950 dark:hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}