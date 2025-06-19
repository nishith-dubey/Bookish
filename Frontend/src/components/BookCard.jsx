import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="bg-white border-2 border-black shadow-[6px_6px_0px_#000] transition-all duration-300 hover:shadow-[4px_4px_0px_#000] rounded-lg">
      <div className="relative border-b-2 border-black h-56">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover p-2"
        />
      </div>
      <div className="p-4 flex flex-col h-48 justify-between">
        <div>
          <h2 className="font-extrabold text-xl text-black mb-1 line-clamp-2">
            {book.title}
          </h2>
          <p className="text-sm text-zinc-700 mb-3 font-medium">{book.author}</p>
        </div>
        <div>
          <div className="flex items-center mb-4">
            <span className="text-black font-bold">
              ⭐ {book.rating.toFixed(1)}
            </span>
            <span className="text-zinc-600 text-sm ml-2">
              ({book.numberOfReviews} reviews)
            </span>
          </div>
          
          <Link
            to={`/books/${book._id}`}
            className="inline-block bg-yellow-400 text-black font-bold text-sm py-2 px-4 border-2 border-black hover:bg-yellow-500 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;