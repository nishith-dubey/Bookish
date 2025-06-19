import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import BookCard from "../components/BookCard.jsx";
import { FaSearch, FaStar, FaUsers } from "react-icons/fa";

const HeroSection = () => (
<section className="bg-amber-50 border-black pt-10">
  <div className="container mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-3 gap-14 items-center">
    <div className="text-center  col-span-2">
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black mb-6">
        Dive Into Your Next Great Read.
      </h1>
      <p className="text-lg md:text-xl text-zinc-700 max-w-xl mx-auto lg:mx-0 mb-10">
        Discover, review, and share books with a vibrant community of readers. Your next favorite story is just a click away.
      </p>
      <Link
        to="/books"
        className="inline-block bg-yellow-400 text-black border-2 border-black px-10 py-4 text-lg font-bold shadow-[8px_8px_0px_#000] hover:shadow-[4px_4px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all"
      >
        Explore Books Now
      </Link>
    </div>
    <div className="hidden lg:flex justify-center items-center">
      <div className="bg-lime-200 p-4 border-4 border-black shadow-[12px_12px_0px_#000]">
        <img 
          src="/girl-160172.svg" 
          alt="Illustration of a person sitting on a stack of books and reading" 
          className="h-auto max-h-[55vh] w-full" 
        />
      </div>
    </div>

  </div>
</section>
);

const FeaturesSection = () => (
  <section className="py-16 md:py-24 bg-lime-200 border-y-4 border-black">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-black">A New Way to Discover</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          icon={<FaSearch size={40} />}
          title="Explore Vastly"
          description="Use our powerful search and filters to find books by title, author, or genre. Uncover hidden gems and popular bestsellers."
        />
        <FeatureCard
          icon={<FaStar size={40} />}
          title="Rate & Review"
          description="Share your honest opinion. Your ratings and reviews help other readers in the community make their next choice."
        />
        <FeatureCard
          icon={<FaUsers size={40} />}
          title="Join the Community"
          description="Create a profile, connect with fellow book lovers, and build your virtual bookshelf for everyone to see."
        />
      </div>
    </div>
  </section>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 border-2 border-black text-center shadow-[8px_8px_0px_#000]">
    <div className="flex justify-center mb-4 text-black">{icon}</div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-zinc-600">{description}</p>
  </div>
);

const FinalCTASection = () => (
    <section className="py-16 md:py-24 bg-amber-50">
        <div className="container mx-auto px-4">
            <div className="bg-blue-300 text-center p-10 border-4 border-black shadow-[8px_8px_0px_#000]">
                <h2 className="text-4xl md:text-5xl font-black text-black mb-4">Ready to Join?</h2>
                <p className="text-lg text-black max-w-2xl mx-auto mb-8">
                    Create a free account to start reviewing books, building your profile, and connecting with readers today.
                </p>
                <Link
                    to="/auth"
                    className="inline-block bg-green-400 text-black border-2 border-black px-10 py-4 text-lg font-bold shadow-[6px_6px_0px_#000] hover:shadow-[3px_3px_0px_#000] hover:-translate-y-1 hover:-translate-x-1 transition-all"
                >
                    Sign Up for Free
                </Link>
            </div>
        </div>
    </section>
);

const Home = () => {
  const apiBaseUrl = "http://localhost:8000";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data } = await axios.get(`${apiBaseUrl}/books?limit=4`);
        setBooks(data.books);
      } catch (err) {
        setError("Failed to load featured books.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="bg-amber-50 min-h-screen border-b-4 border-black">
      
      <HeroSection />
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-400 border-4 border-black text-black font-bold p-4 my-4 shadow-[8px_8px_0px_#000]">
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && books.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-black">
                  Editor's Picks
                </h2>
                <Link to="/books" className="hidden md:inline-block font-bold text-black underline hover:text-blue-600 transition-colors">
                  Explore All →
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {books.map((book) => (
                  <BookCard key={book._id} book={book} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      
      <FeaturesSection />

      <FinalCTASection />
      
    </div>
  );
};

export default Home;