const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

// https://syniiq-backend.onrender.com/api  ->  https://syniiq-backend.onrender.com
export const SERVER_URL = API_URL.replace(/\/api\/?$/, "");

/**
 * Renvoie l'URL affichable d'une image (null s'il n'y en a pas) :
 * - URL Cloudinary : optimisée automatiquement (format et qualité) ;
 * - autre URL complète (https://...) : inchangée ;
 * - ancien chemin relatif ("/uploads/x.jpg") : préfixé par l'adresse du serveur.
 */
export function resoudreUrlMedia(url) {
  if (!url) return null;

  if (/^https?:\/\//i.test(url)) {
    if (url.includes("res.cloudinary.com") && url.includes("/image/upload/")
        && !url.includes("/upload/f_auto")) {
      return url.replace("/image/upload/", "/image/upload/f_auto,q_auto/");
    }
    return url;
  }

  return `${SERVER_URL}${url}`;
}