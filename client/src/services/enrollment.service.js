import api from "./api";

export const getMyEnrollments = async () => {
  const response = await api.get("/enrollments/my-enrollments");
  return response.data;
};

export const testMyEnrollments = async () => {
  const response = await api.get("/enrollments/my-enrollments");
  return response.data;
};

export const enrollInCourse = async (courseId) => {
  const response = await api.post(
    `/enrollments/courses/${courseId}`
  );

  return response.data;
};

export const getEnrollmentById = async (enrollmentId) => {
  const response = await api.get(`/enrollments/${enrollmentId}`);
  return response.data;
};
