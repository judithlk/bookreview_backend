const express = require('express');
const connectDB = require('./config/db');
const bookRoutes = require("./routes/api/books");
const reviewRoutes = require("./routes/api/reviews");
const genreRoutes = require("./routes/api/genres")
const authRoutes = require("./routes/api/auth");
const userRoutes = require("./routes/api/users");
const searchRoutes = require("./routes/api/search")
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/search", searchRoutes);

connectDB();

app.get('/', (req, res) => res.send('Hello beautiful world!'));

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));