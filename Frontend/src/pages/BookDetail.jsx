import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewForm from "../components/ReviewForm";

const BookDetail = () => {
  const apiBaseUrl = "http://localhost:8000";
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchBookDetails = async () => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/books/${id}`);
      setBook(data.book);
    } catch (err) {
      console.error("Error fetching book details:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/reviews?bookId=${id}`);
      setReviews(data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchUserName = async (userId) => {
    try {
      const { data } = await axios.get(`${apiBaseUrl}/users/${userId}`);
      return data.username;
    } catch (err) {
      console.error("Error fetching username:", err);
      return "Anonymous";
    }
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchBookDetails(), fetchReviews()]);
      setLoading(false);
    };
    fetchAllData();
  }, [id]);

  useEffect(() => {
    const fetchAllUsernames = async () => {
      const uniqueUserIds = [...new Set(reviews.map((r) => r.userId))];
      const usernamePromises = uniqueUserIds.map((userId) =>
        fetchUserName(userId).then((username) => ({ userId, username }))
      );
      const userResults = await Promise.all(usernamePromises);
      const usernameMap = userResults.reduce((acc, { userId, username }) => {
        acc[userId] = username;
        return acc;
      }, {});
      setUsernames(usernameMap);
    };
    if (reviews.length) {
      fetchAllUsernames();
    }
  }, [reviews]);

  if (loading) {
    return (
      <div className="bg-amber-50 min-h-screen pt-24 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
      </div>
    );
  }

  if (!book)
    return (
      <p className="bg-amber-50 min-h-screen pt-24 p-4">Book not found.</p>
    );

  return (
    <div className="bg-amber-50 min-h-screen pt-24">
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white border-4 border-black p-6 mb-12 shadow-[8px_8px_0px_#FBBF24]">
          <div className="flex justify-between">
            <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 text-black">
              {book.title}
            </h1>
            <p className="text-xl font-bold text-zinc-700 mb-6">
              by {book.author}
            </p></div>
            <div className="relative border-black h-20 border-2 shadow-[4px_4px_0px_#FBBF24] rounded-lg">
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-full w-full object-cover rounded-lg mr-10"
              />
            </div>
          </div>
          <p className="text-zinc-800 text-base leading-relaxed mb-6">
            {book.description}
          </p>
          <div className="flex flex-wrap gap-x-8 gap-y-4 font-semibold">
            <p>
              <strong>Genre:</strong> {book.genre}
            </p>
            <p>
              <strong>Avg. Rating:</strong> ⭐{" "}
              {book.rating?.toFixed(1) || "N/A"}
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-black mb-6 text-black">Reviews</h2>
        <div className="space-y-6 mb-12">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white border-2 border-black p-4 shadow-[6px_6px_0px_#60A5FA]"
              >
                {" "}
                <p className="font-bold text-lg">
                  {usernames[review.userId] || "..."}
                </p>
                <p className="font-semibold text-yellow-600 mb-2">
                  {"⭐".repeat(review.rating)}
                </p>
                <p className="text-zinc-700">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="font-semibold text-zinc-600">
              No reviews yet. Be the first to write one!
            </p>
          )}
        </div>

        <ReviewForm bookId={book._id} onReviewSubmitted={fetchReviews} />
      </div>
    </div>
  );
};

export default BookDetail;
