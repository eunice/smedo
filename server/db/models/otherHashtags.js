'use strict';
var mongoose = require('mongoose');
var Q = require('q');

var schema = new mongoose.Schema({
    keyword: String,
    text: String,
    count: Number,
    reach: Number,
    sentiment: {
      sum: Number,
      label: {
        type: String,
        enum:['V.Positive','Positive','V.Negative','Negative','Neutral']
      },
      aveScore: Number
    }
});

// var updateOtherHashtags = function(text,keyword){
//     //add to overview
//     text.split(" ").forEach(function(word){
//         word = word.toLowerCase();
//         if (word.indexOf(keyword) === -1) {
//             var initial = word.split("").shift();
//             if (initial === "#") {
//               var re = /([a-z0-9])+/g
//               word = word.match(re)[0];
//               // console.log(word);
//               Overview.findOne({keyword: keyword}).exec().then(function(file){
//                 file.otherHashtags =
//               });
//
//               obj.hashtags[word] = obj.hashtags[word] || {};
//               obj.hashtags[word].count = obj.hashtags[word].count || 0;
//               obj.hashtags[word].count++
//               obj.hashtags[word].totalSentiment = obj.hashtags[word].totalSentiment || 0;
//               obj.hashtags[word].totalSentiment += s;
//               obj.hashtags[word].aveSentiment = obj.hashtags[word].totalSentiment / obj.hashtags[word].count;
//               obj.hashtags[word].reach = obj.hashtags[word].reach || 0;
//               obj.hashtags[word].reach += data.user.followers_count;
//
//               //update other relevant word
//               for (var otherWord in obj.hashtags) {
//                 var alternate = word.slice(0,5);
//                 if (otherWord.indexOf(alternate) !== -1) {
//                   console.log('duplicated',alternate, otherWord)
//                   obj.hashtags[otherWord].count++
//                   obj.hashtags[otherWord].count = obj.hashtags[otherWord].count || 0;
//                   obj.hashtags[otherWord].totalSentiment = obj.hashtags[otherWord].totalSentiment || 0;
//                   obj.hashtags[otherWord].totalSentiment += s;
//                   obj.hashtags[otherWord].aveSentiment = obj.hashtags[otherWord].totalSentiment / obj.hashtags[otherWord].count;
//
//                 }
//               }
//             }
//         }
//       })
// }



mongoose.model('OtherHashtags', schema);
