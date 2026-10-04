import { Crop, ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { resoudreUrlMedia } from "../../config/constants";
import { validateImageFile } from "../../services/fileService";
import ImageCropModal from "./ImageCropModal";

/**
 * Zone d'ajout d'image avec recadrage obligatoire.
 * @param value        URL déjà enregistrée (ex: "/uploads/x.jpg"), ou vide
 * @param file         fichier recadré, pas encore envoyé, ou null
 * @param onFileChange appelé avec le fichier RECADRÉ
 * @param aspect       proportions du cadre : 1 (carré), 16 / 9, 4 / 5...
 * @param cropShape    "rect" ou "round" (aperçu rond ; l'image enregistrée reste rectangulaire)
 * @param className    largeur de la zone (ex: "w-40"), "w-full" par défaut
 */
export default function ImageUpload({
  id = "image-upload",
  value,
  file,
  onFileChange,
  error,
  aspect = 16 / 9,
  cropShape = "rect",
  className = "w-full",
}) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [cropSource, setCropSource] = useState(null); // { src, original } pendant le recadrage
  const [original, setOriginal] = useState(null); // image complète choisie, pour pouvoir recadrer à nouveau
  const [loadingSource, setLoadingSource] = useState(false);

  // Aperçu local du fichier recadré (libéré quand il change)
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setOriginal(null);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const openCrop = (source) => {
    setCropSource({ src: URL.createObjectURL(source), original: source });
  };

  const closeCrop = () => {
    if (cropSource) URL.revokeObjectURL(cropSource.src);
    setCropSource(null);
  };

  const pick = (selected) => {
    if (!selected) return;
    const problem = validateImageFile(selected);
    setLocalError(problem);
    if (!problem) openCrop(selected);
  };

  const handleCropped = (croppedFile) => {
    setOriginal(cropSource.original);
    onFileChange(croppedFile);
    closeCrop();
  };

  // Rouvre le recadrage : image complète choisie > fichier recadré > image enregistrée
  const startRecrop = async () => {
    setLocalError(null);
    let source = original ?? file;
    if (!source) {
      setLoadingSource(true);
      try {
        const res = await fetch(resoudreUrlMedia(value));
        if (!res.ok) throw new Error("Chargement impossible");
        const blob = await res.blob();
        source = new File([blob], "image", { type: blob.type });
      } catch {
        setLocalError("Impossible de charger l'image pour la recadrer. Choisissez-en une nouvelle.");
        return;
      } finally {
        setLoadingSource(false);
      }
    }
    openCrop(source);
  };

  const src = previewUrl ?? resoudreUrlMedia(value);
  const message = localError ?? error;
  const shapeClass = cropShape === "round" ? "rounded-full" : "rounded-xl";

  let stateClass =
    "border-gray-300 bg-gray-100 hover:border-green-400 dark:border-white/15 dark:bg-teal-900/60";
  if (dragging) stateClass = "border-green-400 bg-green-400/10";
  if (message) stateClass = "border-red-400 bg-gray-100 dark:bg-teal-900/60";

  return (
    <div className={className}>
      <label
        htmlFor={id}
        style={{ aspectRatio: aspect }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={`group relative flex w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-dashed transition focus-within:ring-2 focus-within:ring-green-400 ${shapeClass} ${stateClass}`}
      >
        {src ? (
          <>
            <img
              src={src}
              alt="Aperçu de l'image"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 bg-teal-950/70 px-3 py-2 text-center text-xs font-medium text-white opacity-0 transition group-focus-within:opacity-100 group-hover:opacity-100">
              Changer d&apos;image
            </span>
          </>
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-center text-sm text-teal-950/60 dark:text-white/60">
            <ImagePlus className="h-8 w-8" />
            Cliquer ou glisser une image
            <span className="text-xs text-gray-400">JPG, PNG, GIF ou WebP, 5 Mo max</span>
          </span>
        )}

        <input
          id={id}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          className="sr-only"
          onChange={(e) => {
            pick(e.target.files?.[0]);
            e.target.value = ""; // permet de rechoisir le même fichier
          }}
        />
      </label>

      {src && (
        <button
          type="button"
          onClick={startRecrop}
          disabled={loadingSource}
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-teal-950 transition hover:bg-gray-100 disabled:opacity-60 dark:border-white/10 dark:text-white dark:hover:bg-teal-900"
        >
          <Crop className="h-3.5 w-3.5" />
          {loadingSource ? "Chargement..." : "Modifier le cadrage"}
        </button>
      )}

      {message && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{message}</p>}

      {cropSource && (
        <ImageCropModal
          src={cropSource.src}
          fileName={cropSource.original.name}
          fileType={cropSource.original.type}
          aspect={aspect}
          cropShape={cropShape}
          onCancel={closeCrop}
          onConfirm={handleCropped}
        />
      )}
    </div>
  );
}