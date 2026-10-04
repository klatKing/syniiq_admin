import { Pencil, Trash2 } from "lucide-react";
import ServiceIcon from "./ServiceIcon";

export default function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <article className="flex flex-col rounded-md border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-white/10 dark:bg-teal-950">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-400/20 text-teal-950 dark:bg-green-400/15 dark:text-green-400">
          <ServiceIcon icon={service.icon} />
        </div>

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(service)}
            aria-label={`Modifier ${service.title}`}
            title="Modifier"
            className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-teal-950 dark:hover:bg-teal-900 dark:hover:text-green-400"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(service)}
            aria-label={`Supprimer ${service.title}`}
            title="Supprimer"
            className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <h3 className="mt-4 text-base font-semibold text-teal-950 dark:text-white">
        {service.title}
      </h3>
      <p className="mt-2 line-clamp-4 text-sm text-teal-950/60 dark:text-white/60">
        {service.description}
      </p>
    </article>
  );
}