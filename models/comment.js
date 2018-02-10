require('./../config/config');

const mongoose = require('mongoose');
const moment = require('moment');
const {ObjectID} = require('mongodb');

var CommentSchema = new mongoose.Schema({
    Content: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    Author: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },  
    addDate: {
        type: Date,
        default: moment()
    },  
    _movieId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {
    usePushEach: true
});

let Comment = mongoose.model('Comment', CommentSchema);
module.exports = {Comment};