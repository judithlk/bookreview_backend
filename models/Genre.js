const mongoose = require("mongoose");

const GenreSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

module.exports = Genre = mongoose.model('genre', GenreSchema);