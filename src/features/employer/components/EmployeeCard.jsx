import { Pencil, Trash2, User } from "lucide-react";
import { useState } from "react";
import { resoudreUrlMedia } from "../../../config/constants";

function EmployeePhoto({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-teal-900/60">
        <User className="h-10 w-10" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-24 w-24 rounded-full object-cover"
    />
  );
}

export default function EmployeeCard({ employee, onEdit, onDelete }) {
  return (
    <article className="flex flex-col  items-center rounded-2xl border border-gray-200 bg-white p-6 text-center transition hover:shadow-md dark:border-white/10 dark:bg-teal-950">
      <EmployeePhoto key={employee.photoUrl} src={resoudreUrlMedia(employee.photoUrl)} alt={employee.name} />

      <h3 className="mt-4 text-base font-semibold text-teal-950 dark:text-white">
        {employee.name}
      </h3>
      <p className="mt-1 text-sm text-teal-950/60 dark:text-white/60">{employee.position}</p>

      <div className="mt-4 flex gap-1">
        <button
          type="button"
          onClick={() => onEdit(employee)}
          aria-label={`Modifier ${employee.name}`}
          title="Modifier"
          className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-teal-950 dark:hover:bg-teal-900 dark:hover:text-green-400"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onDelete(employee)}
          aria-label={`Supprimer ${employee.name}`}
          title="Supprimer"
          className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}