import { useEffect, useState } from "react";
import { Star, Send, Trash2, Edit2 } from "lucide-react";
import api from "../services/api";

export default function CourseReviews({ courseId, user }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [myReview, setMyReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const userId = String(user?._id || user?.id || "");

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/reviews/courses/${courseId}`);
      const list = response.data?.data?.reviews || [];

      setReviews(list);

      const ownReview = list.find((review) => {
        const studentId =
          review.student?._id || review.student?.id || review.student;

        return String(studentId) === userId;
      });

      setMyReview(ownReview || null);

      if (ownReview) {
        setRating(ownReview.rating);
        setComment(ownReview.comment || "");
      }
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
  }, [courseId, userId]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!rating || rating < 1 || rating > 5) {
      setError("Please select a rating.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const payload = { rating, comment: comment.trim() };

      if (myReview?._id) {
        await api.put(`/reviews/${myReview._id}`, payload);
        setMessage("Your review was updated successfully!");
      } else {
        await api.post(`/reviews/courses/${courseId}`, payload);
        setMessage("Your review was submitted successfully!");
      }

      await loadReviews();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit your review."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!myReview?._id) return;

    if (!window.confirm("Are you sure you want to delete your review?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await api.delete(`/reviews/${myReview._id}`);

      setMyReview(null);
      setRating(5);
      setComment("");
      setMessage("Your review has been deleted.");

      await loadReviews();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to delete your review."
      );
    }
  };

  const averageRating = reviews.length
    ? (
        reviews.reduce((total, review) => total + Number(review.rating || 0), 0) /
        reviews.length
      ).toFixed(1)
    : "0.0";

  const cardStyle = {
    background: "var(--card-bg, #ffffff)",
    border: "1px solid var(--border-color, #e5e7eb)",
    borderRadius: "14px",
    padding: "22px",
    marginTop: "24px",
  };

  const starStyle = (active) => ({
    background: "transparent",
    border: "none",
    cursor: "pointer",
    padding: "3px",
    color: active ? "#F59E0B" : "#CBD5E1",
  });

  return (
    <section style={cardStyle}>
      <div style={{ marginBottom: "20px" }}>
        <span className="eyebrow">STUDENT FEEDBACK</span>
        <h2 style={{ margin: "8px 0" }}>Course Reviews</h2>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Star size={19} fill="#F59E0B" color="#F59E0B" />
          <strong>{averageRating}</strong>
          <span style={{ color: "#64748b" }}>
            ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
          </span>
        </div>
      </div>

      {user?.role === "student" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "28px" }}>
          <h3>{myReview ? "Update your review" : "Write a review"}</h3>

          <p style={{ marginBottom: "8px" }}>Your rating</p>

          <div style={{ display: "flex", gap: "4px", marginBottom: "15px" }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                aria-label={`Rate ${value} stars`}
                onClick={() => setRating(value)}
                style={starStyle(value <= rating)}
              >
                <Star
                  size={27}
                  fill={value <= rating ? "#F59E0B" : "none"}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Share your learning experience..."
            rows={4}
            maxLength={1000}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "13px",
              borderRadius: "9px",
              border: "1px solid #d1d5db",
              font: "inherit",
              resize: "vertical",
            }}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
            <button
              type="submit"
              className="continue-button"
              disabled={submitting}
            >
              <Send size={16} />
              {submitting
                ? "Saving..."
                : myReview
                  ? "Update Review"
                  : "Submit Review"}
            </button>

            {myReview && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  border: "1px solid #ef4444",
                  color: "#ef4444",
                  background: "transparent",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={16} />
                Delete
              </button>
            )}
          </div>
        </form>
      )}

      {message && (
        <p role="status" style={{ color: "#15803d" }}>{message}</p>
      )}

      {error && (
        <p role="alert" style={{ color: "#dc2626" }}>{error}</p>
      )}

      <div>
        <h3>What students say</h3>

        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: "#64748b" }}>
            No reviews yet. Be the first to review this course!
          </p>
        ) : (
          reviews.map((review) => {
            const student = review.student || {};
            const studentName =
              `${student.firstName || ""} ${student.lastName || ""}`.trim() ||
              "Student";

            return (
              <article
                key={review._id}
                style={{
                  padding: "16px 0",
                  borderTop: "1px solid #e5e7eb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{studentName}</strong>
                  <span style={{ color: "#64748b", fontSize: "13px" }}>
                    {review.createdAt
                      ? new Date(review.createdAt).toLocaleDateString()
                      : ""}
                  </span>
                </div>

                <div style={{ display: "flex", margin: "7px 0" }}>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      size={16}
                      color={value <= review.rating ? "#F59E0B" : "#CBD5E1"}
                      fill={value <= review.rating ? "#F59E0B" : "none"}
                    />
                  ))}
                </div>

                <p style={{ margin: 0, lineHeight: 1.6 }}>
                  {review.comment || "No written comment."}
                </p>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}
