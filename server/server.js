require('./../config/config');

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const path = require('path');

const {Movie} = require('./../models/movie');
const {Comment} = require('./../models/comment')
const {mongoose} = require('./../db/mongoose');

const site_root = path.resolve(__dirname+'/..');

let app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const apiKey = 'd59353b3';
const omdbUrl = 'http://www.omdbapi.com/?t=';

let sendErrMessage = (message) => {
    return {
        errorMessage: message
    }
};

// add movie
app.post('/movies', async (req, res) => {

    if (!req.body.Title) {
        res.status(400).send(sendErrMessage('Title is required!'));
    } else {
        // check if it's already exist in the database
        const movieAlreadyFound = await Movie.findOne({
            Title: req.body.Title
        });
        
        // replace spaces to '+'
        const title = req.body.Title.split(' ').join('+');

        // fetching movie data
        const movieRes = await axios
            .get(`${omdbUrl}${title}&plot=full&apikey=${apiKey}`)

        if (movieRes.data.Response === 'False' && movieRes.data.Error) {
            res.status(404).send(movieRes.data.Error);
        } else if (movieAlreadyFound) {

            movieRes.data.Response = Boolean(movieRes
                .data.Response
                .match(/^true$/i));

            try {
                const doc = await Movie.findOneAndUpdate({
                    _id: movieAlreadyFound._id
                }, {$set: movieRes.data}, {new: true});                
                    res.send(doc);        
                } catch (e) {
                    res.status(400).send(e);
                }
        } else {
            movieRes.data.Response = Boolean(movieRes
                .data.Response
                .match(/^true$/i));

            const movieInfo = new Movie(movieRes.data);

            try {
            const doc = await movieInfo.save();
                res.send(doc);        
            } catch (e) {
                res.status(400).send(e);
            }
        }
    }
});

// fetching all movies with details
app.get('/movies', async (req, res) => {    
    try {
        movies = await Movie.find({});        
        res.send({movies});
    } catch (e) {
        res.status(400).send(e);
    }
});

// sorted list of movies
app.get('/movies/sort', async (req, res) => {    
    try {
        movies = await Movie.find().sort({Metascore: 'desc'})
        res.send({movies});
    } catch (e) {
        res.status(400).send(e);
    }
});

// fetching movies by genre
app.get('/movies/param', async (req, res) => {
    try {
        movies = await Movie
            .find({Genre: { $regex: '.*' + req.query.genre + '.*' }})
        res.status(200).send({movies});
    } catch (e) {
        res.status(400).send(e);
    }
});

// add comment to movie
app.post('/comments', async (req, res) => {
    const movieId = req.body._movieId;
    if (!ObjectID.isValid(movieId)) {
        return res.status(404).send(sendErrMessage('Invalid movie ID!'))
    }
    const movieFound = await Movie.findById(movieId)
        .then((movie) =>  movie);
    if (movieFound) {
        const comment = new Comment({
            Content: req.body.Content,
            Author: req.body.Author,
            _movieId: req.body._movieId
        })
        try {
            const doc = await comment.save();
            res.send(doc);
        } catch (e) {
            res.status(400).send(e);
        } 
    } else {
        res.status(400).send(sendErrMessage('Movie not found :('));
    }
});

// get all comments in database
app.get('/comments', async (req, res) => {    
    try {
        comment = await Comment.find({});        
        res.send({comment});
    } catch (e) {
        res.status(400).send(e);
    }
});

// get comments for movie by id
app.get('/comments/:movieId', async (req, res) => {
    const movieId = req.params.movieId
    if (!ObjectID.isValid(movieId)) {
        return res.status(400).send(sendErrMessage('Invalid movie ID!'))
    }

    const movieFound = await Movie.findById(movieId)
    .then((movie) =>  movie);

    if (movieFound) {
        try {
            comment = await Comment.find({_movieId: movieId});        
            res.send({comment});
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(404).send(sendErrMessage('Movie not found :('));
    }
});


app.listen(port, () => {
    console.log(`Started on port ${port}`);
});
  
module.exports = {app};