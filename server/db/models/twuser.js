'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    userid: String,
    screenName: String,
    name: String,
    profileimg: String,
    location: String,
    createdAt: String,
    favorites: Number,
    followers: Number,
    friends: Number,
    statuses: Number,
    description: String,
    tweets: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'Tweet'
    }]
});

//STATIC: check if user exist -> if do, query+update+findid. if not, create+addid

mongoose.model('TwitterUser', schema);
