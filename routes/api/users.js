const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const checkAuth = require('../../middleware/check-auth');

router.get("/test", (req, res) => res.send("users route testing"));

router.get("/", checkAuth, (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(404).json({ message: "No users found" }));
});

router.get("/:id", checkAuth, (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(404).json({ message: "User not found" }));
});

router.delete("/:id", checkAuth, (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user) => res.json({ message: "User deleted successfully" }))
    .catch((err) => res.status(404).json({ error: "Failed to delete" }));
});

module.exports = router;
