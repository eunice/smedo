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

schema.statics.updateAll = function(keyword,hashArr,tweet,twuser) {

}

schema.statics.sortExistedHashtags = function(keyword, hashArr) {
  //get all hashtags with keyword
  this.find({keyword: keyword}).exec().then(function(existedHash){
    for (var i=0; i< hashArr.length; i++){
      //hashArr -> [existed hash] + [new hash]

      // if (hashArr[i])
    }
  });
}

schema.statics.updateExisted = function(existH, tweet, twuser){

}

schema.statics.createNew = function(newH, tweet, twuser){

}

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
