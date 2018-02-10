require('./../config/config');

const mongoose = require('mongoose');
const moment = require('moment');

var MovieSchema = new mongoose.Schema({
    Title: {
      type: String,
      required: true,
      minlength: 1,
      trim: true
    },
    Year: {type: String},
    Rated: {type: String},
    Released: {type: String},
    Runtime: {type: String},
    Genre: {type: String},
    Director: {type: String},
    Writer: {type: String},
    Actors: {type: String},
    Plot: {type: String},
    Language: {type: String},
    Country: {type: String},
    Awards: {type: String},
    Poster: {type: String},
    Ratings: [],
    Metascore: {type: Number},
    imdbRating: {type: Number},
    imdbVotes: {type: String},
    imdbID: {type: String},
    Type: {type: String},
    DVD: {type: String},
    BoxOffice: {type: String},
    Production: {type: String},
    Website: {type: String},
    Response: {type: Boolean},
    }, {
    usePushEach: true
  });

let Movie = mongoose.model('Movie', MovieSchema);
module.exports = {Movie};