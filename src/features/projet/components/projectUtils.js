/** "React, Spring Boot ,MySQL" -> ["React", "Spring Boot", "MySQL"] */
export function parseTechnologies(value) {
  if (!value) return [];
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Nettoie la saisie avant envoi : "React,  MySQL," -> "React, MySQL" (null si vide). */
export function normalizeTechnologies(value) {
  const list = parseTechnologies(value);
  return list.length > 0 ? list.join(", ") : null;
}

/** N'autorise que les liens http(s) (évite les liens javascript: dans les données). */
export function isSafeUrl(url) {
  return typeof url === "string" && /^https?:\/\/\S+$/i.test(url);
}