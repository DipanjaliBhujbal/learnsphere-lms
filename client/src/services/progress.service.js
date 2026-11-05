import api from "./api";

// Fetch progress for a specific course.
export const getCourseProgress = async (courseId) => {
  try {
    const response = await api.get(
      `/progress/courses/${courseId}`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch course progress:", error);
    throw error;
  }
};

// Mark a lesson as completed.
export const completeLesson = async (courseId, lessonId) => {
  try {
    const response = await api.post(
      `/progress/courses/${courseId}/lessons/${lessonId}/complete`
    );

    return response.data;
  } catch (error) {
    console.error("Failed to complete lesson:", error);
    throw error;
  }
};
