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

//es6!!!!
schema.statics.getTweets = function(page,skip,cb){
  var tweets = [],
      start = (page*10) + (skip*1);

  return this.find({})
    .sort({timestamp: 'desc'}).skip(start).limit(20)
    .populate('twuser')
    .exec()

};

schema.statics.checkIfDuplicate = function(twid){
  return this.findOne({twid: twid}).exec()
}

schema.statics.getSentimentScore = function(text){
  var deferred = Q.defer();

  alchemy.sentiment("text", text, {}, function(response) {
    var s = response["docSentiment"] ? response["docSentiment"]["score"] : 0
    if(s) deferred.resolve(s)
    else deferred.reject('nonono')
  });

  return deferred.promise;
};

//use virtual?
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
  var self = this;

  Q(this.constructor.getSentimentScore(this.text)).then(function(score){
    self.sentiment.score = score;
    self.sentiment.label = self.constructor.getSentimentLabel(score);
    next();
  });

})

//METHOD: UPDATE RESPONSE
// schema.method('correctPassword', function (candidatePassword) {
//     return encryptPassword(candidatePassword, this.salt) === this.password;
// });

mongoose.model('Tweet', schema);
