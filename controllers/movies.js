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



module.exports = router