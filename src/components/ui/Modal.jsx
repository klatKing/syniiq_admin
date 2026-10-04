import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ title, onClose, children, footer, size = "max-w-lg" }) {
  // Fermeture avec la touche Échap
  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/60 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-[90vh] w-full ${size} flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-teal-950 dark:ring-1 dark:ring-white/10`}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-gray-100 p-6 pb-4 dark:border-white/10">
          <h2 className="text-lg font-bold text-teal-950 dark:text-white">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-teal-950 dark:hover:bg-teal-900 dark:hover:text-green-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 pt-4">{children}</div>

        {footer && (
          <div className="shrink-0 border-t border-gray-100 p-6 pt-4 dark:border-white/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}