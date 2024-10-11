const express = require('express')
const router = express.Router()
const MovieModel = require('../models/movie')

// Index
router.get('/', async function(req, res) {
    try {
        const moviesDoc = await MovieModel.find({})

        res.status(200).json(moviesDoc)
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post('/', async function(req, res) {
    console.log(req.body, '<- contents of the form')
    console.log(req.user, '<- from the jwt')
    req.body.authorName = req.user.username

    try{
        const movieDoc = await MovieModel.create(req.body);

        res.status(201).json(movieDoc)
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.get('/:id', async function(req,res) {
    try{
        const movieDoc = await MovieModel.findById(req.params.id)

        res.status(200).json(movieDoc)
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})

router.post('/:id/reviews', async function(req, res) {
    console.log(req.body, '<- contents of the form')
    console.log(req.user, '<- from the jwt')
    try{
        const movieDoc = await MovieModel.findById(req.params.id)
        req.body.author = req.user._id
        req.body.authorName = req.user.username
        movieDoc.reviews.push(req.body)

        await movieDoc.save()

        res.status(201).json(movieDoc)
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})


router.put('/:id/reviews/:reviewId', async function(req, res) {
    try{
        const movieDoc = await MovieModel.findById(req.params.id)
        const reviewDoc = movieDoc.reviews.id(req.params.reviewId)
        reviewDoc.set(req.body)
        await movieDoc.save()

        res.status(200).json(movieDoc)
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})


router.delete('/:id/reviews/:reviewId', async function(req, res) {
    console.log(req.body, '<---------------------this is from delete review')
    console.log(req.user, '<---------------------this is from delete review')
    try{
        const movieDoc = await MovieModel.findById(req.params.id)
        movieDoc.reviews.remove(req.params.reviewId)
        await movieDoc.save()

        res.status(200).json({ message: 'review deleted' })
    }catch(err){
        res.status(500).json({ error: err.message });
    }
})




module.exports = router