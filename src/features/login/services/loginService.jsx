import http from "../../../services/http";

export const login = (bodyLogin) =>
  http.post("/auth/login", bodyLogin);

export const getMe = () =>
  http.get("/auth/me");