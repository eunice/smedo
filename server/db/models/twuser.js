'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    userid: String,
    screenName: String,
    name: String,
    location: String,
    createdAt: String,
    favorites: Number,
    followers: Number,
    friends: Number,
    statuses: Number,
    description: String,
    tweets: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'
    }],
    sentiment: {
      label: {
        type: String,
        enum:['V.Positive','Positive','V.Negative','Negative','Neutral']
      },
      score: Number
    }
});

mongoose.model('TwitterUser', schema);
