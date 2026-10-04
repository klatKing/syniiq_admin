import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { getCroppedFile } from "../../utils/cropImage";

export default function ImageCropModal({
  src,
  fileName,
  fileType,
  aspect,
  cropShape = "rect",
  onCancel,
  onConfirm,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  // Échap ferme seulement cette fenêtre (capture : passe avant celle du formulaire)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onCancel]);

  const handleConfirm = async () => {
    if (!area) return;
    setBusy(true);
    setError(null);
    try {
      const file = await getCroppedFile(src, area, { name: fileName, type: fileType });
      onConfirm(file);
    } catch {
      setError("Impossible de recadrer cette image. Essayez-en une autre.");
      setBusy(false);
    }
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Recadrer l'image"
      className="fixed inset-0 z-60 flex items-center justify-center bg-teal-950/80 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl dark:bg-teal-950 dark:ring-1 dark:ring-white/10">
        <h2 className="text-lg font-bold text-teal-950 dark:text-white">Recadrer l&apos;image</h2>
        <p className="mt-1 text-sm text-teal-950/60 dark:text-white/60">
          Déplacez l&apos;image et zoomez. Seule la zone dans le cadre sera conservée.
        </p>

        <div className="relative mt-4 h-[50vh] min-h-70 overflow-hidden rounded-xl bg-black">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            minZoom={1}
            maxZoom={4}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={cropShape === "rect"}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(_, pixels) => setArea(pixels)}
          />
        </div>

        <div className="mt-4 flex items-center gap-3">
          <ZoomOut className="h-4 w-4 text-gray-400" />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Zoom"
            className="h-1.5 flex-1 cursor-pointer accent-green-400"
          />
          <ZoomIn className="h-4 w-4 text-gray-400" />
        </div>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={busy}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-teal-950 transition hover:bg-gray-100 disabled:opacity-60 dark:border-white/10 dark:text-white dark:hover:bg-teal-900"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={busy || !area}
            className="flex items-center gap-2 rounded-xl bg-green-400 px-4 py-2.5 text-sm font-semibold text-teal-950 transition hover:bg-green-300 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            Valider le cadrage
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}