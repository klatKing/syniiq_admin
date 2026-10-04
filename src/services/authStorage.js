const TOKEN_KEY = "syniiq_token";
const USER_KEY = "syniiq_user";
const EXPIRES_KEY = "syniiq_expires_at";

/** Enregistre la session à partir de la réponse du login. */
export function setSession({ token, expiresIn, user }) {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  sessionStorage.setItem(EXPIRES_KEY, String(Date.now() + expiresIn * 1000));
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(sessionStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(EXPIRES_KEY);
}

/** true si un token existe et n'est pas expiré. */
export function isAuthenticated() {
  const expiresAt = Number(sessionStorage.getItem(EXPIRES_KEY));
  return Boolean(getToken()) && Date.now() < expiresAt;
}