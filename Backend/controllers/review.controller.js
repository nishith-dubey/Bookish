import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Book from "../models/book.model.js";

export const getReviews = async (req, res) => {
  try {
    const { bookId } = req.query;
    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required in query." });
    }

    const reviews = await Review.find({ bookId: bookId });
    res.json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching reviews.", error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    if (!bookId || !rating) {
      return res
        .status(400)
        .json({ message: "Book, user, and rating are required." });
    }
    const userId = req.user.userId;

    const review = new Review({ bookId, userId, rating, comment });
    const saved = await review.save();

    const result = await Review.aggregate([
      { $match: { bookId: new mongoose.Types.ObjectId(bookId) } },
      {
        $group: {
          _id: "$bookId",
          avgRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },   
        },
      },
    ]);

    const avgRating = result[0]?.avgRating || 0;
    const reviewCount = result[0]?.reviewCount || 0;

    await Book.findByIdAndUpdate(bookId, { rating: avgRating, numberOfReviews: reviewCount });

    res.status(201).json(saved);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating review.", error: error.message });
  }
};
