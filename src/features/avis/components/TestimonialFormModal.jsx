import { Loader2 } from "lucide-react";
import { useState } from "react";
import ImageUpload from "../../../components/ui/ImageUpload";
import Modal from "../../../components/ui/Modal";
import { useReplaceImage } from "../../../hooks/useUploadImage";
import { getApiError } from "../../login/services/apiError";
import { useCreateTestimonial, useUpdateTestimonial } from "../hooks/useAvisMutations";
import StarRating from "./StarRating";

const LIMITS = { name: 150, company: 150, description: 2000 };

const labelClass = "mb-1.5 block text-sm font-medium text-teal-950 dark:text-white";
const inputClass =
  "w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm text-teal-950 outline-none transition placeholder:text-teal-950/30 focus:ring-2 focus:ring-green-400 dark:bg-teal-900/60 dark:text-white dark:placeholder:text-white/30";

const optional = (value) => value.trim() || null;

/** testimonial = null : création. testimonial = objet : modification. */
export default function TestimonialFormModal({ testimonial, onClose }) {
  const isEdit = Boolean(testimonial);

  const [form, setForm] = useState({
    name: testimonial?.name ?? "",
    company: testimonial?.company ?? "",
    description: testimonial?.description ?? "",
    photoUrl: testimonial?.photoUrl ?? "",
    rating: testimonial?.rating ?? 5,
  });
  const [photoFile, setPhotoFile] = useState(null); // nouvelle photo, pas encore envoyée
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [saving, setSaving] = useState(false);

  const { replace: replaceImage } = useReplaceImage();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGlobalError(null);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Le nom est obligatoire";
    if (!form.description.trim()) e.description = "La description est obligatoire";
    if (!form.rating || form.rating < 1 || form.rating > 5) e.rating = "Choisissez une note de 1 à 5";

    for (const [field, max] of Object.entries(LIMITS)) {
      if (!e[field] && form[field].length > max) e[field] = `${max} caractères maximum`;
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
      // 1. Envoi de la nouvelle photo puis suppression de l'ancienne (si une photo était déjà enregistrée)
      let photoUrl = form.photoUrl;
      if (photoFile) {
        photoUrl = await replaceImage(photoFile, isEdit ? testimonial.photoUrl : null);
        setForm((prev) => ({ ...prev, photoUrl }));
        setPhotoFile(null);
      }

      // 2. Enregistrement de l'avis
      const body = {
        name: form.name.trim(),
        company: optional(form.company),
        description: form.description.trim(),
        photoUrl: photoUrl || null,
        rating: form.rating,
      };

      if (isEdit) {
        await updateTestimonial.mutateAsync({ id: testimonial.id, body });
      } else {
        await createTestimonial.mutateAsync(body);
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
    <Modal title={isEdit ? "Modifier l'avis" : "Nouvel avis"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="flex justify-center">
          <ImageUpload
            id="testimonial-photo"
            value={form.photoUrl}
            file={photoFile}
            aspect={1}
            cropShape="round"
            className="w-32"
            onFileChange={(file) => {
              setPhotoFile(file);
              setGlobalError(null);
            }}
          />
        </div>
        <p className="-mt-3 text-center text-xs text-gray-400">Photo optionnelle</p>

        <div>
          <label htmlFor="testimonial-name" className={labelClass}>
            Nom
          </label>
          <input
            id="testimonial-name"
            type="text"
            autoFocus
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Marie Kamga"
            className={`${inputClass} ${ringError("name")}`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="testimonial-company" className={labelClass}>
            Entreprise <span className="ml-1 font-normal text-gray-400">(optionnel)</span>
          </label>
          <input
            id="testimonial-company"
            type="text"
            value={form.company}
            onChange={(e) => setField("company", e.target.value)}
            placeholder="Acme SARL"
            className={`${inputClass} ${ringError("company")}`}
          />
          {errors.company && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.company}</p>
          )}
        </div>

        <div>
          <label htmlFor="testimonial-description" className={labelClass}>
            Avis
          </label>
          <textarea
            id="testimonial-description"
            rows={4}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Une équipe professionnelle, le site a été livré dans les délais."
            className={`${inputClass} resize-y ${ringError("description")}`}
          />
          <div className="mt-1.5 flex items-start justify-between gap-2">
            {errors.description && (
              <p className="text-xs text-red-600 dark:text-red-400">{errors.description}</p>
            )}
            <span className="ml-auto text-xs text-gray-400">
              {form.description.length}/{LIMITS.description}
            </span>
          </div>
        </div>

        <div>
          <span className={labelClass}>Note</span>
          <StarRating value={form.rating} onChange={(n) => setField("rating", n)} />
          {errors.rating && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.rating}</p>
          )}
        </div>

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
            {isEdit ? "Enregistrer" : "Ajouter l'avis"}
          </button>
        </div>
      </form>
    </Modal>
  );
}