const express = require("express");
const router = express.Router();

const Review = require("../../models/Review");
const Book = require("../../models/Book");
const User = require("../../models/User");

const checkAuth = require("../../middleware/check-auth");

router.get("/", (req, res) => {
  Review.find()
    .then((reviews) => res.json(reviews))
    .catch((err) => res.status(404).json({ noreviews: "No reviews found" }));
});

router.get("/book/:book", async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.book });
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this book" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

router.get("/user/:userId", checkAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.params.userId });
    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for this user" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

router.post("/", checkAuth, async (req, res) => {
  try {
    // Create the new review
    const review = await Review.create(req.body);

    // Update the book's review count
    await Book.findByIdAndUpdate(req.body.book, {
      $inc: { numberOfReviews: 1 },
    });

    // Update the reviewer's review count
    await User.findByIdAndUpdate(req.body.userId, {
      $inc: { numberOfReviews: 1 },
    });

    res.json({ msg: "Review added successfully", data: review });
  } catch (err) {
    res.status(400).json({ error: "Unable to add review" });
  }
});



router.delete("/:id", (req, res) => {
  Review.findByIdAndDelete(req.params.id)
    .then((review) => res.json({ msg: "Review deleted successfully" }))
    .catch((err) => res.status(404).json({ error: "Review not found" }));
});

module.exports = router;
