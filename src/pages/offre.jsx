import { Layers2, Plus, RefreshCw } from "lucide-react";
import { useState } from "react";
import DeleteServiceModal from "../features/offre/components/DeleteServiceModal";
import ServiceCard from "../features/offre/components/ServiceCard";
import ServiceFormModal from "../features/offre/components/ServiceFormModal";
import { useServices } from "../features/offre/hooks/useServices";

export default function Offre() {
  const { data: services = [], isLoading, isError, refetch } = useServices();

  // formModal : null (fermé) | { service: null } (création) | { service } (modification)
  const [formModal, setFormModal] = useState(null);
  const [serviceToDelete, setServiceToDelete] = useState(null);

  const openCreate = () => setFormModal({ service: null });

  return (
    <div className="p-6 lg:p-8">
      {/* En-tête */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-teal-950 dark:text-white">Offres</h1>
          <p className="mt-1 text-sm text-teal-950/60 dark:text-white/60">
            Les services proposés par l&apos;entreprise, affichés sur le site.
            {!isLoading && !isError && ` ${services.length} service${services.length > 1 ? "s" : ""}.`}
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-green-400 px-4 py-2.5 text-sm font-semibold text-teal-950 transition hover:bg-green-300"
        >
          <Plus className="h-4 w-4" />
          Nouveau service
        </button>
      </div>

      {/* Chargement */}
      {isLoading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-2xl bg-gray-200 dark:bg-teal-900/60"
            />
          ))}
        </div>
      )}

      {/* Erreur */}
      {isError && (
        <div className="rounded-2xl border border-red-500/30 bg-red-50 p-6 text-center dark:bg-red-500/10">
          <p className="text-sm text-red-700 dark:text-red-300">
            Impossible de charger les services.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-1.5 text-sm text-red-700 transition hover:bg-red-100 dark:text-red-300 dark:hover:bg-red-500/20"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        </div>
      )}

      {/* Liste vide */}
      {!isLoading && !isError && services.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 p-12 text-center dark:border-white/15">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-400/20 text-teal-950 dark:text-green-400">
            <Layers2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-teal-950 dark:text-white">
            Aucun service pour le moment
          </h2>
          <p className="mt-1 text-sm text-teal-950/60 dark:text-white/60">
            Ajoutez votre premier service pour l&apos;afficher sur le site.
          </p>
          <button
            type="button"
            onClick={openCreate}
            className="mt-5 flex items-center gap-2 rounded-xl bg-green-400 px-4 py-2.5 text-sm font-semibold text-teal-950 transition hover:bg-green-300"
          >
            <Plus className="h-4 w-4" />
            Créer un service
          </button>
        </div>
      )}

      {/* Liste */}
      {!isLoading && !isError && services.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={(s) => setFormModal({ service: s })}
              onDelete={setServiceToDelete}
            />
          ))}
        </div>
      )}

      {/* Fenêtres */}
      {formModal && (
        <ServiceFormModal
          key={formModal.service?.id ?? "new"}
          service={formModal.service}
          onClose={() => setFormModal(null)}
        />
      )}
      {serviceToDelete && (
        <DeleteServiceModal
          service={serviceToDelete}
          onClose={() => setServiceToDelete(null)}
        />
      )}
    </div>
  );
}