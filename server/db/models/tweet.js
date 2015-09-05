'use strict';
var mongoose = require('mongoose');
var Q = require('q');
var Alchemy = require('../../alchemy-api');
var alchemy = new Alchemy();

var schema = new mongoose.Schema({
    twid: String,
    twuser: {
      type: mongoose.Schema.Types.ObjectId, ref: 'TwitterUser'
    },
    keyword: String,
    createdAt: String,
    timestamp: {type: Date, default: Date.now},
    active: Boolean,
    text: String,
    sentiment: {
      label: {
        type: String,
        enum:['V.Positive','Positive','V.Negative','Negative','Neutral']
      },
      score: Number
    },
    response: {
      status: Boolean,
      responseText: String
    }
});

schema.statics.getTweets = function(page,skip,cb){
  var tweets = [],
      start = (page*10) + (skip*1);

  // Tweet.find({})
};

schema.statics.checkIfDuplicate = function(twid){
  this.findOne({twid: twid}).exec().then(function(tweet){
    if (!tweet) return false;
    else return true;
  })
}

schema.statics.getSentimentScore = function(text){
  console.log('@sentiment!!!start')

  var deferred = Q.defer();

  alchemy.sentiment("text", text, {}, function(response) {
    console.log('sentiment res!!!', response["docSentiment"]["score"]);
    var s = response["docSentiment"]["score"] || 0;

    if (s) deferred.resolve(s)
    else deferred.reject('nonono')

  });

  return deferred.promise;
};

schema.statics.getSentimentLabel = function(s){
  var l;

  if (s > 0.5 && s <= 1) l = "V.Positive"
  else if (s > 0 && s <= 0.5) l = "Positive"
  else if (s === 0) l = "Neutral"
  else if (s > -0.5 && s < 0) l = "Negative"
  else if (s >= -1 && s <= -0.5) l = "V.Negative"

  return l;
}

schema.pre('save', function(next){
  console.log('presave tweet', this.constructor.getSentimentScore(this.text))

  Q(this.constructor.getSentimentScore(this.text))
  .then(function(score){
    console.log('scoreee',score)
    this.sentiment.score = score;
    this.sentiment.label = this.constructor.getSentimentLabel(score);
    console.log('label',label)
    next();
  })

})

//METHOD: UPDATE RESPONSE

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// schema.pre('save', function (next) {
//
//     if (this.isModified('password')) {
//         this.salt = this.constructor.generateSalt();
//         this.password = this.constructor.encryptPassword(this.password, this.salt);
//     }
//
//     next();
// });

// schema.method('correctPassword', function (candidatePassword) {
//     return encryptPassword(candidatePassword, this.salt) === this.password;
// });

mongoose.model('Tweet', schema);
