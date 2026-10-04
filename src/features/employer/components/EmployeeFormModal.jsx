import { Loader2 } from "lucide-react";
import { useState } from "react";
import ImageUpload from "../../../components/ui/ImageUpload";
import Modal from "../../../components/ui/Modal";
import { useReplaceImage } from "../../../hooks/useUploadImage";
import { getApiError } from "../../login/services/apiError";
import { useCreateEmployee, useUpdateEmployee } from "../hooks/useEmployerMutations";

const LIMITS = { name: 150, position: 150 };

const labelClass = "mb-1.5 block text-sm font-medium text-teal-950 dark:text-white";
const inputClass =
  "w-full rounded-xl bg-gray-100 px-4 py-2.5 text-sm text-teal-950 outline-none transition placeholder:text-teal-950/30 focus:ring-2 focus:ring-green-400 dark:bg-teal-900/60 dark:text-white dark:placeholder:text-white/30";

/** employee = null : création. employee = objet : modification. */
export default function EmployeeFormModal({ employee, onClose }) {
  const isEdit = Boolean(employee);

  const [form, setForm] = useState({
    name: employee?.name ?? "",
    position: employee?.position ?? "",
    photoUrl: employee?.photoUrl ?? "",
  });
  const [photoFile, setPhotoFile] = useState(null); // nouvelle photo, pas encore envoyée
  const [errors, setErrors] = useState({});
  const [globalError, setGlobalError] = useState(null);
  const [saving, setSaving] = useState(false);

  const { replace: replaceImage } = useReplaceImage();
  const createEmployee = useCreateEmployee();
  const updateEmployee = useUpdateEmployee();

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setGlobalError(null);
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Le nom est obligatoire";
    else if (form.name.length > LIMITS.name) e.name = `${LIMITS.name} caractères maximum`;

    if (!form.position.trim()) e.position = "Le poste est obligatoire";
    else if (form.position.length > LIMITS.position) e.position = `${LIMITS.position} caractères maximum`;

    if (!photoFile && !form.photoUrl) e.photoUrl = "La photo est obligatoire";
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
      // 1. Envoi de la nouvelle photo puis suppression de l'ancienne (si elle existait)
      let photoUrl = form.photoUrl;
      if (photoFile) {
        photoUrl = await replaceImage(photoFile, isEdit ? employee.photoUrl : null);
        setForm((prev) => ({ ...prev, photoUrl }));
        setPhotoFile(null);
      }

      // 2. Enregistrement de l'employé
      const body = {
        name: form.name.trim(),
        position: form.position.trim(),
        photoUrl,
      };

      if (isEdit) {
        await updateEmployee.mutateAsync({ id: employee.id, body });
      } else {
        await createEmployee.mutateAsync(body);
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
    <Modal title={isEdit ? "Modifier l'employé" : "Nouvel employé"} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="flex justify-center">
          <ImageUpload
            id="employee-photo"
            value={form.photoUrl}
            file={photoFile}
            error={errors.photoUrl}
            aspect={4 / 5}
            className="w-40"
            onFileChange={(file) => {
              setPhotoFile(file);
              setErrors((prev) => ({ ...prev, photoUrl: undefined }));
              setGlobalError(null);
            }}
          />
        </div>

        <div>
          <label htmlFor="employee-name" className={labelClass}>
            Nom complet
          </label>
          <input
            id="employee-name"
            type="text"
            autoFocus
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Jean Dupont"
            className={`${inputClass} ${ringError("name")}`}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="employee-position" className={labelClass}>
            Poste
          </label>
          <input
            id="employee-position"
            type="text"
            value={form.position}
            onChange={(e) => setField("position", e.target.value)}
            placeholder="Développeur Full Stack"
            className={`${inputClass} ${ringError("position")}`}
          />
          {errors.position && (
            <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{errors.position}</p>
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
            {isEdit ? "Enregistrer" : "Ajouter l'employé"}
          </button>
        </div>
      </form>
    </Modal>
  );
}