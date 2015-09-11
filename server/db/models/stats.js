'use strict';
var mongoose = require('mongoose');
var Q = require('q');

var schema = new mongoose.Schema({
    keyword: String, //*
    numTweets: Number, //*
    frequencyPerMin: Number,
    numImpressions: Number, //*
    numUniqueUsers: Number, //*
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
  return this.findOne({keyword: keyword}).exec().then(function(file){
    //if keyword instance !exist > create
    if (!file) {
      return self.create({
        keyword: keyword
      });
    }
  })
};

schema.statics.updateUniqueUser = function(keyword) {
  this.findOne({keyword: keyword}).exec().then(function(file){
    console.log('i am incre unique users!!')
    file.numUniqueUsers = file.numUniqueUsers || 1;
    file.numUniqueUsers++
    file.save()
  })
}

schema.statics.update = function(keyword, tweet, twuser) {
  return this.findOne({keyword: keyword}).exec().then(function(file){
    //update Tweets
    file.numTweets = file.numTweets || 1;
    file.numTweets++;
    //update Impressions
    file.numImpressions = file.numImpressions || twuser.followers;
    file.numImpressions += twuser.followers;
    //update Users (updated directly on user model)

    //update Sentiments
    file.sumSentiments =  file.sumSentiments || tweet.sentiment.score;
    file.sumSentiments += tweet.sentiment.score;
    file.aveSentiments = file.sumSentiments / file.numTweets;

    //update hashtag
    
    file.save();
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
