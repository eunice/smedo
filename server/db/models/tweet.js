'use strict';
var mongoose = require('mongoose');
var Alchemy = require('../../alchemy-api');
var alchemy = new Alchemy();

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

schema.statics.getTweets = function(page,skip,cb){
  var tweets = [],
      start = (page*10) + (skip*1);

  // Tweet.find({})
};

var checkForUser = function(){
  //find user id
  //found -> getId
  //not found -> createUser,getId
}

var getSentiment = function(text){
  var s, l;
  alchemy.sentiment("text", text, {}, function(response) {
    s = response["docSentiment"]["score"] || 0;

    if (s > 0.5 && s <= 1) l = "V.Positive"
    else if (s > 0 && s <= 0.5) l = "Positive"
    else if (s === 0) l = "Neutral"
    else if (s > -0.5 && s < 0) l = "Negative"
    else if (s >= -1 && s <= -0.5) l = "V.Negative"

    return {score: s, label: l}
  });
};

var getOtherHashtags = function(text,keyword){
    //add to overview
}

// text.split(" ").forEach(function(word){
//     word = word.toLowerCase();
//     if (word.indexOf("trump") === -1) {
//         var initial = word.split("").shift();
//         if (initial === "#") {
//           var re = /([A-Za-z0-9])+/g
//           word = word.match(re)[0];
//           // console.log(word);
//           obj.hashtags = obj.hashtags || {};
//           obj.hashtags[word] = obj.hashtags[word] || {};
//           obj.hashtags[word].count = obj.hashtags[word].count || 0;
//           obj.hashtags[word].count++
//           obj.hashtags[word].totalSentiment = obj.hashtags[word].totalSentiment || 0;
//           obj.hashtags[word].totalSentiment += s;
//           obj.hashtags[word].aveSentiment = obj.hashtags[word].totalSentiment / obj.hashtags[word].count;
//           obj.hashtags[word].reach = obj.hashtags[word].reach || 0;
//           obj.hashtags[word].reach += data.user.followers_count;
//
//           //update other relevant word
//           for (var otherWord in obj.hashtags) {
//             var alternate = word.slice(0,5);
//             if (otherWord.indexOf(alternate) !== -1) {
//               console.log('duplicated',alternate, otherWord)
//               obj.hashtags[otherWord].count++
//               obj.hashtags[otherWord].count = obj.hashtags[otherWord].count || 0;
//               obj.hashtags[otherWord].totalSentiment = obj.hashtags[otherWord].totalSentiment || 0;
//               obj.hashtags[otherWord].totalSentiment += s;
//               obj.hashtags[otherWord].aveSentiment = obj.hashtags[otherWord].totalSentiment / obj.hashtags[otherWord].count;
//
//             }
//           }
//         }
//     }
//   })

var createTweet = function (t,u) {}

// pre-save
schema.pre('save', function(next){

})
// post
schema.post('save', function(tweet){
  console.log('tweet saved!', tweet)
  return tweet;
})

//METHOD: UPDATE RESPONSE

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
