import { Loader2 } from "lucide-react";
import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { getApiError } from "../../login/services/apiError";
import { useCreateService, useUpdateService } from "../hooks/useOffreMutations";
import IconPicker from "./IconPicker";

const TITLE_MAX = 150;
const DESCRIPTION_MAX = 2000;

const labelClass = "mb-1.5 block text-sm font-medium text-teal-950 dark:text-white";
const inputClass =
  "w-full rounded-md bg-gray-100 px-4 py-2.5 text-sm text-teal-950 outline-none transition placeholder:text-teal-950/30 focus:ring-2 focus:ring-green-400 dark:bg-teal-900/60 dark:text-white dark:placeholder:text-white/30";

function FieldError({ message }) {
  return message ? (
    <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{message}</p>
  ) : null;
}

/** service = null : création. service = objet : modification. */
export default function ServiceFormModal({ service, onClose }) {
  const isEdit = Boolean(service);

  const [form, setForm] = useState({
    icon: service?.icon ?? "",
    title: service?.title ?? "",
    description: service?.description ?? "",
  });
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);

  const createMutation = useCreateService();
  const updateMutation = useUpdateService();
  const mutation = isEdit ? updateMutation : createMutation;
  const isSaving = mutation.isPending ?? mutation.isLoading;

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGlobalError(null);
  };

  const validate = () => {
    const e = {};
    if (!form.icon.trim()) e.icon = "Choisissez une icône";
    if (!form.title.trim()) e.title = "Le titre est obligatoire";
    else if (form.title.length > TITLE_MAX) e.title = `${TITLE_MAX} caractères maximum`;
    if (!form.description.trim()) e.description = "La description est obligatoire";
    else if (form.description.length > DESCRIPTION_MAX)
      e.description = `${DESCRIPTION_MAX} caractères maximum`;
    return e;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    const body = {
      icon: form.icon.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
    };
    const options = {
      onSuccess: onClose,
      onError: (error) => {
        const { message, fields } = getApiError(error);
        setErrors(fields);
        setGlobalError(Object.keys(fields).length > 0 ? null : message);
      },
    };

    if (isEdit) {
      updateMutation.mutate({ id: service.id, body }, options);
    } else {
      createMutation.mutate(body, options);
    }
  };

  return (
    <Modal
      title={isEdit ? "Modifier le service" : "Nouveau service"}
      onClose={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-teal-950 transition hover:bg-gray-100 dark:border-white/10 dark:text-white dark:hover:bg-teal-900"
          >
            Annuler
          </button>
          <button
            type="submit"
            form="service-form"
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-green-400 px-4 py-2.5 text-sm font-semibold text-teal-950 transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isEdit ? "Enregistrer" : "Créer le service"}
          </button>
        </div>
      }
    >
      <form id="service-form" onSubmit={handleSubmit} noValidate className="space-y-5">
       

        <div>
          <label htmlFor="service-title" className={labelClass}>
            Titre
          </label>
          <input
            id="service-title"
            type="text"
            autoFocus
            value={form.title}
            onChange={(e) => setField("title", e.target.value)}
            placeholder="Développement web"
            className={`${inputClass} ${errors.title ? "ring-2 ring-red-400" : ""}`}
          />
          <FieldError message={errors.title} />
        </div>

        <div>
          <label htmlFor="service-description" className={labelClass}>
            Description
          </label>
          <textarea
            id="service-description"
            rows={5}
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
            placeholder="Conception de sites vitrines, e-commerce et applications web sur mesure."
            className={`${inputClass} resize-y ${errors.description ? "ring-2 ring-red-400" : ""}`}
          />
          <div className="mt-1.5 flex items-start justify-between gap-2">
            <FieldError message={errors.description} />
            <span className="ml-auto text-xs text-gray-400">
              {form.description.length}/{DESCRIPTION_MAX}
            </span>
          </div>
        </div>
         <div>
          <span className={labelClass}>Icône</span>
          <IconPicker value={form.icon} onChange={(v) => setField("icon", v)} error={errors.icon} />
        </div>

        {globalError && (
          <p
            role="alert"
            className="rounded-lg border border-red-500/30 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-300"
          >
            {globalError}
          </p>
        )}
      </form>
    </Modal>
  );
}