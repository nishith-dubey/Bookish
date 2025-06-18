import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: String, // baad me: connect with real user model
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String
  }
}, { timestamps: true });

const Review = mongoose.model('review', reviewSchema);

export default Review;
