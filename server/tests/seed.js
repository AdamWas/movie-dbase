const env = require('./../../config/config');

const {ObjectID} = require('mongodb');

const {Movie} = require('./../../models/Movie');
const {Comment} = require('./../../models/Comment');

movieOneId = new ObjectID();
movieTwoId = new ObjectID();

const movies = [{
    Title: 'test title',
    _id: movieOneId,
    Year: '2005',
    Response: true,
    Genre: 'Drama'
},{
    Title: 'test title 2',
    _id: movieTwoId,
    Year: '2012',
    Response: true
}];

const comments =[{
    Content: 'test comment 1',
    Author: 'User 1',
    _movieId: movieOneId
},{
    Content: 'test comment 2',
    Author: 'User 2',
    _movieId: movieOneId
},{
    Content: 'test comment 3',
    Author: 'User 1',
    _movieId: movieTwoId
}]

const populateMovies = (done) => {
    Movie.remove({}).then(() => {
        return Movie.insertMany(movies);
    }).then(() => done());
};

const populateComments = (done) => {
    Comment.remove({}).then(() => {
        return Comment.insertMany(comments);
    }).then(() => done());
};

module.exports = {populateComments, populateMovies, movies, comments}