import http from "../../../services/http";

export const getEmployees = () => http.get("/employees");

export const createEmployee = (bodyEmployee) => http.post("/employees", bodyEmployee);

export const updateEmployee = (id, bodyEmployee) => http.put(`/employees/${id}`, bodyEmployee);

export const deleteEmployee = (id) => http.delete(`/employees/${id}`);