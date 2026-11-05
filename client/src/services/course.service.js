import api from "./api";

export const getCourses = async (params = {}) => {
  const response = await api.get("/courses", { params });
  return response.data;
};

export const getCourseById = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`);
  return response.data;
};
