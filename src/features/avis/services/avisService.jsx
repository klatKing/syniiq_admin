import http from "../../../services/http";

export const getTestimonials = () => http.get("/testimonials");

export const createTestimonial = (bodyTestimonial) => http.post("/testimonials", bodyTestimonial);

export const updateTestimonial = (id, bodyTestimonial) => http.put(`/testimonials/${id}`, bodyTestimonial);

export const deleteTestimonial = (id) => http.delete(`/testimonials/${id}`);