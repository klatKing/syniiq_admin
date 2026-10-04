import http from "../../../services/http";

export const getProjects = () => http.get("/projects");

export const createProject = (bodyProject) => http.post("/projects", bodyProject);

export const updateProject = (id, bodyProject) => http.put(`/projects/${id}`, bodyProject);

export const deleteProject = (id) => http.delete(`/projects/${id}`);