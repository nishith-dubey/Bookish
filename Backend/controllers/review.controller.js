import Review from '../models/review.model.js';

export const getReviews = async (req, res) => {
  try {
    const { bookId } = req.query;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required in query.' });
    }

    const reviews = await Review.find({ bookId: bookId });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews.', error: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { bookId, user, rating, comment } = req.body;

    if (!bookId || !user || !rating) {
      return res.status(400).json({ message: 'Book, user, and rating are required.' });
    }

    const review = new Review({ bookId, user, rating, comment });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review.', error: error.message });
  }
};
