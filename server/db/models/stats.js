'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    keyword: String,
    startTime: String,
    endTime: String,
    numTweets: Number,
    numImpressions: Number,
    numUniqueUsers: Number,
    users: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'TwitterUser'
    }],
    sentiments: {
      sum: Number,
      average: Number,
      vpositive: Number,
      positive: Number,
      neutral: Number,
      negative: Number,
      vnegative: Number
    },
    hashtags: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'OtherHashtags'
    }]
});





mongoose.model('Stats', schema);
