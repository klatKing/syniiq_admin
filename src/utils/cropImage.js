const MAX_SIDE = 1600; // taille maximale du côté le plus long, pour garder des fichiers légers

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Formats de sortie acceptés par le backend (jpg, png, gif, webp) ; le gif devient png
function outputFormat(type) {
  if (type === "image/webp") return { mime: "image/webp", ext: "webp" };
  if (type === "image/png" || type === "image/gif") return { mime: "image/png", ext: "png" };
  return { mime: "image/jpeg", ext: "jpg" };
}

/**
 * Découpe la zone choisie et retourne un File prêt à être envoyé.
 * @param src  URL de l'image (object URL)
 * @param area zone en pixels fournie par react-easy-crop : { x, y, width, height }
 */
export async function getCroppedFile(src, area, { name = "image", type = "image/jpeg" } = {}) {
  const img = await loadImage(src);

  const scale = Math.min(1, MAX_SIDE / Math.max(area.width, area.height));
  const width = Math.round(area.width * scale);
  const height = Math.round(area.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, width, height);

  const { mime, ext } = outputFormat(type);
  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Export impossible"))), mime, 0.92)
  );

  const base = name.replace(/\.[^.]+$/, "") || "image";
  return new File([blob], `${base}.${ext}`, { type: mime });
}