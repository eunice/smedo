'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    twid: String,
    twuser: {
      type: mongoose.Schema.Types.ObjectId, ref: 'TwitterUser'
    },
    hashtag: String,
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
    otherHashtags: [String],
    response: {
      status: Boolean,
      responseText: String
    }
});

//STATIC: GET TWEETS
schema.statics.getTweets = function(page,skip,cb){
  var tweets = [],
      start = (page*10) + (skip*1);

  // Tweet.find({})
};

//STATIC: UPDATE RESPONSE

//STATIC: otherHashtag filter
//SENTIMENT -> type
//STATIC: check if user exist -> if do, query+update+findid. if not, create+addid

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// var generateSalt = function () {
//     return crypto.randomBytes(16).toString('base64');
// };
//
// schema.pre('save', function (next) {
//
//     if (this.isModified('password')) {
//         this.salt = this.constructor.generateSalt();
//         this.password = this.constructor.encryptPassword(this.password, this.salt);
//     }
//
//     next();
// });
//
// schema.statics.generateSalt = generateSalt;
//
// schema.method('correctPassword', function (candidatePassword) {
//     return encryptPassword(candidatePassword, this.salt) === this.password;
// });

mongoose.model('Tweet', schema);
