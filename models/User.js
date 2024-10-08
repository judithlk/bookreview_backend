const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
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

module.exports = User = mongoose.model('user', UserSchema);