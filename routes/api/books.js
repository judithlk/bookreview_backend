const express = require("express");
const cloudinary = require("../../config/cloudinary")
const multer = require("multer")
const router = express.Router();
const Book = require("../../models/Book");
const upload = multer({ dest: "uploads/" });
const checkAuth = require("../../middleware/check-auth")

router.get("/test", (req, res) => res.send("book route testing"));

router.get("/", (req, res) => {
  Book.find()
    .then((books) => res.json(books))
    .catch((err) => res.status(404).json({ nobooksfound: "No books found" }));
});

router.get("/:id", (req, res) => {
  Book.findById(req.params.id)
    .then((book) => res.json(book))
    .catch((err) => res.status(404).json({ nobookfound: "No Book found" }));
});

router.get("/genre/:genre", async (req, res) => {
  try{
    const books = await Book.find({genre: req.params.genre});
    if(books.length === 0) {
      return res.status(404).json({ message: "No reviews books for this genre"})
    }
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({message: "Error fetching books"});
  }  
});

router.post("/", checkAuth, upload.single("image"), async (req, res) => {
  try {
    let cloudinaryId = null;
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "book_covers", 
      });
      cloudinaryId = result.public_id;
      imageUrl = result.secure_url;
    }

    const newBook = new Book({
      title: req.body.title,
      author: req.body.author,
      synopsis: req.body.synopsis,
      genre: req.body.genre,
      year: req.body.year,
      cloudinaryId: cloudinaryId,
      imageUrl: imageUrl,
    });

    const book = await newBook.save();
    res.json({ message: "Book added successfully", data: book });
  } catch (err) {
    res.status(400).json({ error: "Unable to add this book" });
  }
});

router.put("/:id", checkAuth, (req, res) => {
  Book.findByIdAndUpdate(req.params.id, req.body)
    .then((book) => res.json({ message: "Book updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Failed to update the book" })
    );
});

router.delete("/:id", checkAuth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Delete the image from Cloudinary
    if (book.cloudinaryId) {
      await cloudinary.uploader.destroy(book.cloudinaryId);
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete the book" });
  }
});

module.exports = router;