import Book from "../models/book.model.js";
import Review from "../models/review.model.js";

export const getAllBooks = async (req, res) => {
  try {
    const { page = 1, search = "", genre = "" } = req.query;
    const limit = 9;
    const skip = (page - 1) * limit;

    const filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (genre) {
      filter.genre = genre;
    }

    const totalBooks = await Book.countDocuments(filter);
    const books = await Book.find(filter).skip(skip).limit(limit);

    res.json({
      books,
      totalPages: Math.ceil(totalBooks / limit),
    });
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

export const deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id)

    res.json({
      message: "Book deleted successfully",
      status: true
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting book.", error: error.message });
  }
}

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found." });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
      success: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating book.", error: error.message });
  }
};