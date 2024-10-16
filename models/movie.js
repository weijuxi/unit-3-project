const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    authorName: String,
    movieId: String
})



module.exports = mongoose.model('Review', reviewSchema)