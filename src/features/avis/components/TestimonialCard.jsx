import { Pencil, Quote, Trash2, User } from "lucide-react";
import { useState } from "react";
import { resoudreUrlMedia } from "../../../config/constants";
import StarRating from "./StarRating";

function AvatarPhoto({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-teal-900/60">
        <User className="h-5 w-5" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-11 w-11 shrink-0 rounded-full object-cover"
    />
  );
}

export default function TestimonialCard({ testimonial, onEdit, onDelete }) {
  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-md dark:border-white/10 dark:bg-teal-950">
      <div className="flex items-start justify-between gap-3">
        <StarRating value={testimonial.rating} readOnly />

        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onEdit(testimonial)}
            aria-label={`Modifier l'avis de ${testimonial.name}`}
            title="Modifier"
            className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-teal-950 dark:hover:bg-teal-900 dark:hover:text-green-400"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(testimonial)}
            aria-label={`Supprimer l'avis de ${testimonial.name}`}
            title="Supprimer"
            className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Quote className="mt-3 h-5 w-5 text-green-400/60" />
      <p className="mt-2 line-clamp-4 text-sm text-teal-950/70 dark:text-white/70">
        {testimonial.description}
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-gray-100 pt-4 dark:border-white/10">
        <AvatarPhoto key={testimonial.photoUrl} src={resoudreUrlMedia(testimonial.photoUrl)} alt={testimonial.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-teal-950 dark:text-white">
            {testimonial.name}
          </p>
          {testimonial.company && (
            <p className="truncate text-xs text-teal-950/50 dark:text-white/50">
              {testimonial.company}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}