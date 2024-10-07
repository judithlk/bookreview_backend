const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretKey = "your-secret-key";

const cloudinary = require("../../config/cloudinary");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Upload image to Cloudinary
    let cloudinaryId = null;
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles", // Folder name in Cloudinary
      });
      cloudinaryId = result.public_id;
      imageUrl = result.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      cloudinaryId,
      imageUrl,
    });

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({
        error: "Email already taken.",
      });

    const existingUsername = await User.findOne({ username });
    if (existingUsername)
      return res.status(400).json({
        error: "Username already taken.",
      });

    await user.save();

    res.status(201).json({ message: "Registration successful", data: user });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    // Create a JWT token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      secretKey,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ accessToken, user: user });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
