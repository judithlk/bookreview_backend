const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    synopsis: {
        type: String
    },
    genre: {
        type: String
    },
    year: {
        type: String,
    },
    cloudinaryId: {
        type: String,
    },
    imageUrl: {
        type: String
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
},
{
    timestamps: true
})

module.exports = Book = mongoose.model('book', BookSchema);