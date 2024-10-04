const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    book: {
        type: String,
        required: true,
        index: true
    },
    userId: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }, 
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number, 
        default: 0
    },
},
{
    timestamps: true
})

module.exports = Review = mongoose.model('review', ReviewSchema);