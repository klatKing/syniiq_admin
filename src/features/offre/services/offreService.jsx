import http from "../../../services/http";

export const getServices = () => http.get("/services");

export const createService = (bodyService) => http.post("/services", bodyService);

export const updateService = (id, bodyService) => http.put(`/services/${id}`, bodyService);

export const deleteService = (id) => http.delete(`/services/${id}`);