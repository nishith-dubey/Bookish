import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ReviewForm = ({ bookId, onReviewSubmitted }) => {
  const apiBaseUrl = "http://localhost:8000";
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClasses = "w-full p-3 bg-white border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium";
  const buttonClasses = "border-2 border-black px-6 py-3 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:bg-zinc-400 disabled:shadow-none disabled:cursor-not-allowed";

  const submitReview = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axios.post(
        `${apiBaseUrl}/reviews`,
        {
          userId: user._id,
          bookId,
          rating: Number(rating),
          comment,
        },
        { headers: { token: `${localStorage.getItem("token")}` } }
      );
      setComment("");
      setRating(5);
      onReviewSubmitted();
    } catch (err) {
      setError(err?.response?.data?.message || "Review submission failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-4 bg-blue-200 border-2 border-black">
        <Link to={"/auth"} className="font-bold text-black underline hover:text-blue-800">
          Login to rate books and write reviews!
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submitReview} className="bg-lime-200 border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
      <h3 className="text-2xl font-black mb-4 text-black">Submit a Review</h3>
      
      {error && (
        <div className="bg-red-400 border-2 border-black text-black font-bold p-3 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="rating" className="block font-bold mb-1 text-black">Rating</label>
        <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className={inputClasses}>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} Star{r > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block font-bold mb-1 text-black">Comment</label>
        <textarea
          id="comment"
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          rows="4"
          className={inputClasses}
        />
      </div>

      <button type="submit" disabled={loading} className={`${buttonClasses} bg-green-400 hover:bg-green-500 w-full`}>
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;