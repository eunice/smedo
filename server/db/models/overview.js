'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    keyword: String,
    startTime: String,
    endTime: String,
    numTweets: Number,
    numImpressions: Number,
    numUniqueUsers: Number,
    totalSentiment: Number,
    aveSentiment: Number,
    otherHashtags: [String],
    hitLimit: Boolean
});


mongoose.model('Overview', schema);
