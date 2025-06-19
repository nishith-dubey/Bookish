import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Make sure Link is imported
import axios from "axios";
import BookCard from "../components/BookCard.jsx";

const Home = () => {
  const apiBaseUrl = "http://localhost:8000";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/books`);
        // On the home page, we only want to feature a few books
        setBooks(res.data.books.slice(0, 4)); // Let's feature just 4 for a cleaner look
        setLoading(false);
      } catch (err) {
        setError("Failed to load featured books.");
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Reusable Neobrutalism button style for the CTA
  const ctaButtonClasses = "inline-block border-2 border-black px-10 py-4 text-lg font-bold shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:translate-y-1 hover:translate-x-1 transition-all";


  return (
    <div className="bg-amber-50 min-h-screen pt-20">
      <div className="container mx-auto px-4 py-12">
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-400 border-4 border-black text-black font-bold p-4 my-4 shadow-[8px_8px_0px_#000]">
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl md:text-5xl font-black text-black">
                Featured Books
              </h1>
              <Link to="/books" className="hidden md:inline-block font-bold text-black underline hover:text-blue-600 transition-colors">
                Explore All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {books.map((book) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>

            <div className="text-center mt-16">
              <Link to="/books" className={`${ctaButtonClasses} bg-purple-400 hover:bg-purple-500`}>
                Browse The Full Collection
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;