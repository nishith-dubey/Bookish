import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  genre: {
    type: String
  },
  rating: {
    type: Number,
    default: 0
  },
  coverImage: {
    type: String
  }
}, { timestamps: true });

const Book = mongoose.model('book', bookSchema);

export default Book;
