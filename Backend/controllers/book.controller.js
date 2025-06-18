import Book from "../models/book.model.js";
import Review from "../models/review.model.js";

export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching books." });
  }
};

export const addBook = async (req, res) => {
  try {
    const { title, author, description, genre, coverImage } = req.body;

    if (!title || !author) {
      return res
        .status(400)
        .json({ message: "Title and author are required." });
    }

    const newBook = new Book({
      title,
      author,
      description,
      genre,
      coverImage,
    });

    const savedBook = await newBook.save();
    res.status(201).json({
      book: savedBook,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding book", error: error.message });
  }
};

export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.json({
      book,
      // avgRating: book.rating,
      // reviewCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching book.", error: error.message });
  }
};
