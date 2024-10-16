const express = require('express')
const router = express.Router()
const MovieModel = require('../models/movie')

const OMDB_API_KEY = '31e9d121';


async function fetchMovieFromOMDB(imdbID) {
    const response = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=${OMDB_API_KEY}`);
    return response.data;
}

// Index
// Get list of movies (use OMDB API for fetching movies by search)
router.get('/', async function(req, res) {
    const { search } = req.query; // e.g., ?search=Batman
    if (!search) {
        return res.status(400).json({ error: "Please provide a search query" });
    }

    try {
        const response = await axios.get(`http://www.omdbapi.com/?s=${search}&apikey=${OMDB_API_KEY}`);
        res.status(200).json(response.data.Search); // Return search results
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get movie details and its reviews
router.get('/:imdbID', async function(req, res) {
    const { imdbID } = req.params;
    
    try {
        // Fetch movie details from OMDB
        const movieData = await fetchMovieFromOMDB(imdbID);

        // Fetch associated reviews from MongoDB
        const reviews = await ReviewModel.find({ movieId: imdbID });

        res.status(200).json({
            movie: movieData,
            reviews: reviews
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a review for a movie
router.post('/:imdbID/reviews', async function(req, res) {
    const { imdbID } = req.params;
    console.log(req.body, '<- contents of the form');
    console.log(req.user, '<- from the jwt');
    try {
        const review = new ReviewModel({
            ...req.body,
            author: req.user._id,
            authorName: req.user.username,
            movieId: imdbID  // Associate the review with the OMDB movie ID
        });

        await review.save();

        res.status(201).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a review
router.put('/:imdbID/reviews/:reviewId', async function(req, res) {
    try {
        const review = await ReviewModel.findById(req.params.reviewId);
        review.set(req.body);
        await review.save();

        res.status(200).json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete a review
router.delete('/:imdbID/reviews/:reviewId', async function(req, res) {
    console.log(req.body, '<---------------------this is from delete review');
    console.log(req.user, '<---------------------this is from delete review');
    try {
        const review = await ReviewModel.findByIdAndDelete(req.params.reviewId);

        res.status(200).json({ message: 'review deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});




module.exports = router