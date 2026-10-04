import { Loader2 } from "lucide-react";
import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { getApiError } from "../../login/services/apiError";
import { useDeleteService } from "../hooks/useOffreMutations";

export default function DeleteServiceModal({ service, onClose }) {
  const [error, setError] = useState(null);
  const mutation = useDeleteService();
  const isDeleting = mutation.isPending ?? mutation.isLoading;

  const handleDelete = () => {
    mutation.mutate(service.id, {
      onSuccess: onClose,
      onError: (err) => setError(getApiError(err).message),
    });
  };

  return (
    <Modal title="Supprimer le service" onClose={onClose} size="max-w-md">
      <p className="text-sm text-teal-950/70 dark:text-white/70">
        Voulez-vous vraiment supprimer <strong>{service.title}</strong> ? Cette action est
        définitive et le service disparaîtra aussitôt du site.
      </p>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-teal-950 transition hover:bg-gray-100 dark:border-white/10 dark:text-white dark:hover:bg-teal-900"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
          Supprimer
        </button>
      </div>
    </Modal>
  );
}