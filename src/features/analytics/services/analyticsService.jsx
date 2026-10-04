import http from "../../../services/http";

export const getAnalyticsSummary = (days = 14) =>
  http.get("/analytics/summary", { params: { days } });