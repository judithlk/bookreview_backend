const express = require("express");
const router = express.Router();
const Genre = require("../../models/Genre");
const checkAuth = require("../../middleware/check-auth")

router.get("/", (req, res) => {
  Genre.find()
    .then((genres) => res.json(genres))
    .catch((err) => res.status(404).json({ message: "No genres found" }));
});

router.get("/:id", (req, res) => {
  Genre.findById(req.params.id)
    .then((genre) => res.json(genre))
    .catch((err) => res.status(404).json({ message: "No genre found" }));
});

router.post("/", checkAuth, (req, res) => {
  Genre.create(req.body)
    .then((genre) => res.json({ message: "Genre added successfully", data: genre }))
    .catch((err) => res.status(400).json({ error: "Failed to add genre" }));
});

router.put("/:id", checkAuth, (req, res) => {
  Genre.findByIdAndUpdate(req.params.id, req.body)
    .then((genre) => res.json({ message: "Updated successfully" }))
    .catch((err) =>
      res.status(400).json({ error: "Failed to update the genre" })
    );
});

router.delete("/:id", checkAuth, (req, res) => {
  Genre.findByIdAndDelete(req.params.id)
    .then((genre) => res.json({ message: "Genre deleted successfully" }))
    .catch((err) => res.status(404).json({ error: "Review not found" }));
});

module.exports = router;