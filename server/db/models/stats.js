'use strict';
var mongoose = require('mongoose');
var Q = require('q');

var schema = new mongoose.Schema({
    keyword: String, //*
    numTweets: Number, //*
    frequencyPerMin: Number,
    numImpressions: Number, //*
    numUniqueUsers: Number, //*
    // users: [{
    //   type: mongoose.Schema.Types.ObjectId, ref: 'TwitterUser'
    // }],
    sumSentiments: Number, //*
    aveSentiments: Number, //*
    sentiments: { //*
      vpositive: Number,
      positive: Number,
      neutral: Number,
      negative: Number,
      vnegative: Number
    }
    // hashtags: [{
    //   type: mongoose.Schema.Types.ObjectId, ref: 'OtherHashtags'
    // }]
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

//update Users (updated directly on user model)
schema.statics.updateUniqueUser = function(keyword) {
  this.findOne({keyword: keyword}).exec().then(function(file){
    console.log('i am incre unique users!!')
    file.numUniqueUsers = file.numUniqueUsers || 0;
    file.numUniqueUsers++
    file.save()
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

schema.statics.update = function(keyword, tweet, twuser) {
  var self = this;
  return this.findOne({keyword: keyword}).exec().then(function(file){
    //update Tweets
    file.numTweets = file.numTweets || 0;
    file.numTweets++;
    //update Impressions
    file.numImpressions = file.numImpressions || twuser.followers;
    file.numImpressions += twuser.followers;

    //update Sentiments
    file.sumSentiments =  file.sumSentiments || tweet.sentiment.score;
    file.sumSentiments += tweet.sentiment.score;
    file.aveSentiments = file.sumSentiments / file.numTweets;
    var label = self.constructor.getSentiments(tweet.sentiment.score);
    file.sentiments[label] = file.sentiments[label] || 0;
    file.sentiments[label]++;

    //update hashtag
    var otherHashtags = self.constructor.getHashtags(keyword,tweet.text);
    mongoose.model('otherHashtags').updateAll(keyword,otherHashtags,tweet,twuser)
    .then(function(){
      console.log('updated other hashtags')
    })

    file.save();
    return file; // check
  });
}

schema.statics.getHashtags = function(keyword,text){
  text.split(" ").forEach(function(word){
      word = word.toLowerCase();
      if (word.indexOf(keyword) === -1) {
          var initial = word.split("").shift();
          if (initial === "#") {
            var re = /([a-z0-9])+/g
            word = word.match(re)[0];
          }
      }
  };

}


//get user
  //if unique, uniqueUser++


mongoose.model('Stats', schema);
