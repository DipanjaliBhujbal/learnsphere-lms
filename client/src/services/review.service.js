import api from "./api";

export const getCourseReviews = async (courseId) => {
  const response = await api.get(`/reviews/courses/${courseId}`);
  return response.data;
};

export const createReview = async (courseId, reviewData) => {
  const response = await api.post(
    `/reviews/courses/${courseId}`,
    reviewData
  );
  return response.data;
};

export const updateReview = async (reviewId, reviewData) => {
  const response = await api.put(`/reviews/${reviewId}`, reviewData);
  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);
  return response.data;
};