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
    authorName: String
})

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true,
        enums: ['Fantasy', 'Mystery', 'Drama', 'Suspense', 'Action', 'Superhero','Romance']
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    reviews: [reviewSchema]
})


module.exports = mongoose.model('Review', movieSchema)