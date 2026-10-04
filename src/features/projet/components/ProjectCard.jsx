import { Building2, ExternalLink, ImageOff, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { resoudreUrlMedia } from "../../../config/constants";
import { isSafeUrl, parseTechnologies } from "./projectUtils";

const MAX_TAGS = 4;

function ProjectImage({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400 dark:bg-teal-900/60">
        <ImageOff className="h-8 w-8" />
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
    />
  );
}

export default function ProjectCard({ project, onEdit, onDelete }) {
  const technologies = parseTechnologies(project.technologies);
  const hiddenCount = technologies.length - MAX_TAGS;
  console.log(resoudreUrlMedia(project.imageUrl))

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md dark:border-white/10 dark:bg-teal-950">
      <div className="relative aspect-video overflow-hidden">
        <ProjectImage
          key={project.imageUrl}
          src={resoudreUrlMedia(project.imageUrl)}
          alt={project.title}
        />
        {project.category && (
          <span className="absolute left-3 top-3 rounded-full bg-green-400 px-2.5 py-1 text-xs font-semibold text-teal-950">
            {project.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-teal-950 dark:text-white">
          {project.title}
        </h3>

        {project.clientName && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-teal-950/60 dark:text-white/60">
            <Building2 className="h-3.5 w-3.5" />
            {project.clientName}
          </p>
        )}

        <p className="mt-3 line-clamp-3 text-sm text-teal-950/60 dark:text-white/60">
          {project.description}
        </p>

        {technologies.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {technologies.slice(0, MAX_TAGS).map((tech) => (
              <li
                key={tech}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-teal-950 dark:bg-teal-900 dark:text-white/80"
              >
                {tech}
              </li>
            ))}
            {hiddenCount > 0 && (
              <li className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500 dark:bg-teal-900 dark:text-white/50">
                +{hiddenCount}
              </li>
            )}
          </ul>
        )}

        <div className="mt-auto flex items-center justify-between pt-5">
          {isSafeUrl(project.projectUrl) ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-950 underline-offset-2 hover:underline dark:text-green-400"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Voir le projet
            </a>
          ) : (
            <span />
          )}

          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onEdit(project)}
              aria-label={`Modifier ${project.title}`}
              title="Modifier"
              className="rounded-md p-2 text-gray-400 transition hover:bg-gray-100 hover:text-teal-950 dark:hover:bg-teal-900 dark:hover:text-green-400"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              aria-label={`Supprimer ${project.title}`}
              title="Supprimer"
              className="rounded-md p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}