'use strict';
var mongoose = require('mongoose');
var Q = require('q');

var schema = new mongoose.Schema({
    keyword: String,
    numTweets: Number,
    frequencyPerMin: Number, //need to get date first
    numImpressions: Number,
    numUniqueUsers: Number,
    users: [{
      type: mongoose.Schema.Types.ObjectId, ref: 'TwitterUser'
    }],
    sumSentiments: Number,
    aveSentiments: Number,
    sentiments: {
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

schema.statics.checkAndCreate = function(keyword){
  var self = this;
  return this.findOne({keyword: keyword}).exec().then(function(stats){
    //if keyword instance !exist > create
    if (!stats) {
      return self.create({
        keyword: keyword,
      });
    }

  })
};

schema.statics.update = function(keyword, tweet, twuser) {
  return this.findOne({keyword: keyword}).exec().then(function(stats){
    //update Tweets
    stats.numTweets = stats.numTweets || 1;
    stats.numTweets++;
    //update Impressions
    stats.numImpressions = stats.numImpressions || twuser.followers;
    stats.numImpressions += twuser.followers;
    //update Users
    
    //update Sentiments

    stats.save();
  })
}

schema.statics.getSentiments = function(score){
  var l;

  if (s > 0.5 && s <= 1) l = "vpositive"
  else if (s > 0 && s <= 0.5) l = "positive"
  else if (s === 0) l = "neutral"
  else if (s > -0.5 && s < 0) l = "negative"
  else if (s >= -1 && s <= -0.5) l = "vnegative"

  return l;
}

//get tweet
  //numTweets ++
  //numImpressions += twuser's followers
  //sentimentSum += sentiment score
  //virtual : sentiment ave = sum / numTweets
  //if V.positive -> sentiment.vpositive ++

//get user
  //if unique, uniqueUser++

//get hashtags
  //check other hashtag schema
  //if unique, create other hashtag schema instance

  //if not, update

mongoose.model('Stats', schema);
