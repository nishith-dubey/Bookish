import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import BookCard from "../components/BookCard";

const BookList = () => {
  const apiBaseUrl = "http://localhost:8000";

  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  // Reusable style constants
  const inputClasses = "w-full p-3 bg-white border-2 border-black focus:outline-none focus:ring-2 focus:ring-yellow-400 font-medium";
  const paginationButtonClasses = "border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_#000] hover:shadow-[2px_2px_0px_#000] hover:-translate-y-0.5 hover:-translate-x-0.5 transition-all disabled:bg-zinc-400 disabled:text-zinc-600 disabled:shadow-none disabled:cursor-not-allowed";

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${apiBaseUrl}/books`, {
        params: { page, search, genre },
      });
      setBooks(res.data.books);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching books:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(fetchBooks, 500); // Debounce search
    return () => clearTimeout(timeoutRef.current);
  }, [page, search, genre]);

  return (
    // Main container with padding for fixed navbar
    <div className="bg-amber-50 min-h-screen p-24">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl md:text-5xl font-black text-black mb-8">Explore All Books</h1>

        {/* Filter Section */}
        <div className="bg-lime-200 border-2 border-black p-4 mb-10 shadow-[8px_8px_0px_#000]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className={inputClasses}
            />
            <select
              value={genre}
              onChange={(e) => {
                setGenre(e.target.value);
                setPage(1);
              }}
              className={inputClasses}
            >
              <option value="">All Genres</option>
              <option value="Fiction">Fiction</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Romance">Romance</option>
              <option value="Mystery">Mystery</option>
              <option value="Cricket">Cricket</option>
            </select>
          </div>
        </div>

        {/* Book Grid */}
        {loading ? (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
            </div>
        ) : (
            <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                {books.length > 0 ? (
                    books.map((book) => <BookCard key={book._id} book={book} />)
                ) : (
                    <div className="col-span-full text-center bg-yellow-200 border-2 border-black p-4 font-semibold">
                    <p>No books found matching your criteria.</p>
                    </div>
                )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className={`${paginationButtonClasses} bg-white hover:bg-zinc-100`}>
                    ← Prev
                    </button>
                    <span className="font-bold text-lg text-black">
                    Page {page} of {totalPages}
                    </span>
                    <button onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className={`${paginationButtonClasses} bg-white hover:bg-zinc-100`}>
                    Next →
                    </button>
                </div>
                )}
            </>
        )}
      </div>
    </div>
  );
};

export default BookList;