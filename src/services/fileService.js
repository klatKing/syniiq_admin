import http from "./http";

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 Mo, comme le backend
const ALLOWED_EXTENSIONS = /\.(jpe?g|png|gif|webp)$/i;

export function validateImageFile(file) {
  if (!ALLOWED_EXTENSIONS.test(file.name)) {
    return "Format non autorisé. Formats acceptés : jpg, png, gif, webp.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Fichier trop volumineux (5 Mo maximum).";
  }
  return null;
}

export const uploadImage = (file) => {
  const body = new FormData();
  body.append("file", file);
  return http.post("/files/upload", body);
};

export const deleteImage = (url) => http.delete("/files", { params: { url } });