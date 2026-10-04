import { Loader2 } from "lucide-react";
import { useState } from "react";
import ImageUpload from "../../../components/ui/ImageUpload";
import Modal from "../../../components/ui/Modal";
import { useReplaceImage } from "../../../hooks/useUploadImage";
import { getApiError } from "../../login/services/apiError";
import { useCreateProject, useUpdateProject } from "../hooks/useProjetMutations";
import { isSafeUrl, normalizeTechnologies } from "./projectUtils";

const LIMITS = {
  title: 150,
  description: 3000,
  category: 100,
  clientName: 150,
  technologies: 500,
  projectUrl: 500,
};

const labelClass = "mb-1.5 block text-sm font-medium text-teal-950 dark:text-white";
const inputClass =
  "w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm text-teal-950 outline-none transition placeholder:text-teal-950/30 focus:ring-2 focus:ring-green-400 dark:bg-teal-900/60 dark:text-white dark:placeholder:text-white/30";

const optional = (value) => value.trim() || null;

function Field({ id, label, optionalField, error, children }) {
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
        {optionalField && <span className="ml-1 font-normal text-gray-400">(optionnel)</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

/** project = null : création. project = objet : modification. */
export default function ProjectFormModal({ project, onClose }) {
  const isEdit = Boolean(project);

  const [form, setForm] = useState({
    title: project?.title ?? "",
    description: project?.description ?? "",
    imageUrl: project?.imageUrl ?? "",
    category: project?.category ?? "",
    clientName: project?.clientName ?? "",
    technologies: project?.technologies ?? "",
    projectUrl: project?.projectUrl ?? "",
  });
  const [imageFile, setImageFile] = useState(null); // nouvelle image, pas encore envoyée
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [saving, setSaving] = useState(false);

  const { replace: replaceImage } = useReplaceImage();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGlobalError(null);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Le titre est obligatoire";
    if (!form.description.trim()) e.description = "La description est obligatoire";
    if (!imageFile && !form.imageUrl) e.imageUrl = "L'image est obligatoire";

    for (const [field, max] of Object.entries(LIMITS)) {
      if (!e[field] && form[field].length > max) e[field] = `${max} caractères maximum`;
    }
    const url = form.projectUrl.trim();
    if (!e.projectUrl && url && !isSafeUrl(url)) {
      e.projectUrl = "Le lien doit commencer par http:// ou https://";
    }
    return e;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    setGlobalError(null);
    try {
      // 1. Envoi de la nouvelle image puis suppression de l'ancienne (si elle existait)
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await replaceImage(imageFile, isEdit ? project.imageUrl : null);
        setForm((prev) => ({ ...prev, imageUrl }));
        setImageFile(null);
      }

      // 2. Enregistrement du projet
      const body = {
        title: form.title.trim(),
        description: form.description.trim(),
        imageUrl,
        category: optional(form.category),
        clientName: optional(form.clientName),
        technologies: normalizeTechnologies(form.technologies),
        projectUrl: optional(form.projectUrl),
      };

      if (isEdit) {
        await updateProject.mutateAsync({ id: project.id, body });
      } else {
        await createProject.mutateAsync(body);
      }
      onClose();
    } catch (error) {
      const { message, fields } = getApiError(error);
      setErrors(fields);
      setGlobalError(Object.keys(fields).length > 0 ? null : message);
    } finally {
      setSaving(false);
    }
  };

  const ringError = (field) => (errors[field] ? "ring-2 ring-red-400" : "");

  return (
    <Modal title={isEdit ? "Modifier le projet" : "Nouveau projet"} onClose={onClose} size="max-w-2xl">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <Field id="project-image" label="Image" error={null}>
          <ImageUpload
            id="project-image"
            value={form.imageUrl}
            file={imageFile}
            error={errors.imageUrl}
            aspect={16 / 9}
            onFileChange={(file) => {
              setImageFile(file);
              setErrors((prev) => ({ ...prev, imageUrl: undefined }));
              setGlobalError(null);
            }}
          />
        </Field>

        <Field id="project-title" label="Titre" error={errors.title}>
          <input
            id="project-title"
            type="text"
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Plateforme e-commerce Mbeka"
            className={`${inputClass} ${ringError("title")}`}
          />
        </Field>

        <Field id="project-description" label="Description" error={errors.description}>
          <textarea
            id="project-description"
            rows={5}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Boutique en ligne avec paiement mobile et gestion des stocks."
            className={`${inputClass} resize-y ${ringError("description")}`}
          />
          <p className="mt-1.5 text-right text-xs text-gray-400">
            {form.description.length}/{LIMITS.description}
          </p>
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field id="project-category" label="Catégorie" optionalField error={errors.category}>
            <input
              id="project-category"
              type="text"
              value={form.category}
              onChange={(e) => setField("category", e.target.value)}
              placeholder="Site web"
              className={`${inputClass} ${ringError("category")}`}
            />
          </Field>

          <Field id="project-client" label="Client" optionalField error={errors.clientName}>
            <input
              id="project-client"
              type="text"
              value={form.clientName}
              onChange={(e) => setField("clientName", e.target.value)}
              placeholder="Mbeka SARL"
              className={`${inputClass} ${ringError("clientName")}`}
            />
          </Field>
        </div>

        <Field id="project-technologies" label="Technologies" optionalField error={errors.technologies}>
          <input
            id="project-technologies"
            type="text"
            value={form.technologies}
            onChange={(e) => setField("technologies", e.target.value)}
            placeholder="React, Spring Boot, MySQL"
            className={`${inputClass} ${ringError("technologies")}`}
          />
          <p className="mt-1.5 text-xs text-gray-400">Séparez les technologies par des virgules.</p>
        </Field>

        <Field id="project-url" label="Lien du projet" optionalField error={errors.projectUrl}>
          <input
            id="project-url"
            type="url"
            value={form.projectUrl}
            onChange={(e) => setField("projectUrl", e.target.value)}
            placeholder="https://www.mbeka.com"
            className={`${inputClass} ${ringError("projectUrl")}`}
          />
        </Field>

        {globalError && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
          >
            {globalError}
          </p>
        )}

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-teal-950 transition hover:bg-gray-100 disabled:opacity-60 dark:border-white/10 dark:text-white dark:hover:bg-teal-900"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-green-400 px-4 py-2.5 text-sm font-semibold text-teal-950 transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Enregistrer" : "Créer le projet"}
          </button>
        </div>
      </form>
    </Modal>
  );
}