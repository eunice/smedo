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

schema.statics.getSentiment = function(text){
  var s, l;
  console.log('@sentiment!!!start',text.split(' ')[0])
  var start = Date.now()

  alchemy.sentiment("text", text, {}, function(response) {
    s = response["docSentiment"]["score"] || 0;
    console.log('sentiment res!!!', response["docSentiment"]["score"])

    if (s > 0.5 && s <= 1) l = "V.Positive"
    else if (s > 0 && s <= 0.5) l = "Positive"
    else if (s === 0) l = "Neutral"
    else if (s > -0.5 && s < 0) l = "Negative"
    else if (s >= -1 && s <= -0.5) l = "V.Negative"

    console.log('s!!!!!!!!',s,l)

    return Q({label: l, score: s});
  });
};

schema.pre('save', function(next){
  console.log('presave tweet')

  this.sentiment = this.constructor.getSentiment(this.text);
  next();
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
