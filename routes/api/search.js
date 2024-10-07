const express = require("express");
const router = express.Router();
const Book = require("../../models/Book");

router.get("/", async (req, res) => {
    try {
      const { query } = req.query;   
     

      const books = await Book.find({
        $or: [
          { title: { $regex: query, $options: "i" } }, // Case-insensitive search
          { author: { $regex: query, $options: "i" } },
        //   { genre: { $regex: query, $options: "i" } },
          { year: { $regex: query, $options: "i" } },
        ],
      });
  
      if (books.length === 0) {
        return res.status(404).json({ message: "No books found" });
      }
  
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ error: "Error fetching books" });
    }
  });
  
  module.exports = router;