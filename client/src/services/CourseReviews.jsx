import { useEffect, useState } from "react";
import {
  Star,
  Send,
  Trash2,
  Edit3,
  MessageSquare,
} from "lucide-react";

import {
  getCourseReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../services/review.service";

const CourseReviews = ({ courseId, user }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = String(user?._id || user?.id || "");

  const myReview = reviews.find((review) => {
    const studentId =
      typeof review.student === "object"
        ? review.student?._id
        : review.student;

    return String(studentId) === userId;
  });

  const loadReviews = async () => {
    try {
      setLoading(true);

      const response = await getCourseReviews(courseId);

      setReviews(response?.data?.reviews || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load reviews."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) loadReviews();
  }, [courseId]);

  useEffect(() => {
    if (myReview && !editing) {
      setRating(myReview.rating);
      setComment(myReview.comment || "");
    }
  }, [myReview, editing]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      setError("Please select a rating and write a review.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      if (myReview) {
        await updateReview(myReview._id, {
          rating,
          comment: comment.trim(),
        });
        setMessage("Review updated successfully!");
      } else {
        await createReview(courseId, {
          rating,
          comment: comment.trim(),
        });
        setMessage("Review submitted successfully!");
      }

      setEditing(false);
      await loadReviews();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = () => {
    setRating(myReview.rating);
    setComment(myReview.comment || "");
    setEditing(true);
    setMessage("");
    setError("");
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete your review?")) return;

    try {
      await deleteReview(myReview._id);

      setRating(5);
      setComment("");
      setEditing(false);
      setMessage("Review deleted successfully!");

      await loadReviews();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete review."
      );
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <section
      style={{
        marginTop: "30px",
        padding: "24px",
        background: "var(--card-bg, #fff)",
        border: "1px solid var(--border-color, #e5e7eb)",
        borderRadius: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          marginBottom: "20px",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>Student Reviews</h2>
          <p style={{ color: "#777", marginBottom: 0 }}>
            Share your learning experience
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <h2 style={{ margin: 0 }}>
            <Star
              size={19}
              fill="#f5a623"
              color="#f5a623"
              style={{ verticalAlign: "middle" }}
            />{" "}
            {averageRating}
          </h2>
          <small style={{ color: "#777" }}>
            {reviews.length} reviews
          </small>
        </div>
      </div>

      {user?.role === "student" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "25px" }}>
          <h3>
            {myReview ? "Your Review" : "Write a Review"}
          </h3>

          <div style={{ display: "flex", gap: "7px", margin: "12px 0" }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} star rating`}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  padding: 2,
                }}
              >
                <Star
                  size={27}
                  color={value <= rating ? "#f5a623" : "#bbb"}
                  fill={value <= rating ? "#f5a623" : "none"}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you think about this course?"
            rows={3}
            required
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              resize: "vertical",
              font: "inherit",
              boxSizing: "border-box",
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              type="submit"
              disabled={submitting}
              className="continue-button"
            >
              <Send size={16} />
              {submitting
                ? "Saving..."
                : myReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>

            {myReview && (
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="text-link"
                >
                  <Edit3 size={16} />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="text-link"
                  style={{ color: "#dc2626" }}
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </>
            )}
          </div>
        </form>
      )}

      {message && (
        <p style={{ color: "green" }}>{message}</p>
      )}

      {error && (
        <p style={{ color: "#dc2626" }}>{error}</p>
      )}

      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={{ color: "#777" }}>
          <MessageSquare size={17} /> No reviews yet. Be the first!
        </p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {reviews.map((review) => {
            const student = review.student || {};
            const studentName =
              typeof student === "object"
                ? `${student.firstName || ""} ${student.lastName || ""}`.trim()
                : "Student";

            return (
              <div
                key={review._id}
                style={{
                  padding: "16px",
                  border: "1px solid #eee",
                  borderRadius: "12px",
                }}
              >
                <strong>{studentName || "Student"}</strong>

                <div style={{ margin: "7px 0" }}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      size={15}
                      color={value <= review.rating ? "#f5a623" : "#bbb"}
                      fill={value <= review.rating ? "#f5a623" : "none"}
                      style={{ marginRight: 3 }}
                    />
                  ))}
                </div>

                <p style={{ marginBottom: 5 }}>{review.comment}</p>

                <small style={{ color: "#888" }}>
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString()
                    : ""}
                </small>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default CourseReviews;