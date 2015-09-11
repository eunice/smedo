'use strict';
var mongoose = require('mongoose');
var Q = require('q');

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
    //dynamic data:
    tweets: [{
      keyword: String,
      count: Number
    }],
    sentimentSum: Number,
    sentimentAve: Number
});

schema.statics.checkAndCreate = function(u, keyword, sentiment, cb){
  // console.log('user checking and creating')
  var self = this;
  return this.findOne({userid: u.userid}).exec().then(function(user){
    if (!user){
      //updating dynamic data
      u.tweets = [{keyword: keyword, count: 1}];
      u.sentimentSum = sentiment;
      u.sentimentAve = sentiment;
      //update unique user
      console.log('is unqiue user updated?')
      mongoose.model('Stats').updateUniqueUser(keyword);
      return self.create(u);

    } else {
      //update existing user
      //update dynamic tweets count portion
      for (var i=0; i< user.tweets.length; i++) {
        if (user.tweets[i].keyword === keyword) {
          user.tweets[i].count++;
        } else {
          user.tweets.push({keyword: keyword, count: 1});
        }
      };
      //update dynamic sentiment portion
      var count = 0;
      for (var i=0; i< user.tweets.length; i++) {
        count += user.tweets[i].count;
      };
      user.sentimentSum += sentiment;
      user.sentimentAve = user.sentimentSum / count;
      console.log('is existed user updated?')
      return user.save();

    }
  },cb);
};

mongoose.model('TwitterUser', schema);
