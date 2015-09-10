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
      responseText: [String]
    }
});

//time interval
  //search keyword + get all tweets
  //get ascending order
  //get timestamp (every 5 min) = 300000/ms
  //until the next 300,000/ms ->
    //sum all impressions
    //
    //create multi-dimensional array


schema.statics.getTweetById = function(id){
  return this.findOne({_id: id}).populate('twuser').exec()
}

schema.statics.getTweets = function(page,skip,cb){
  var tweets = [],
      start = (page*10) + (skip*1);

  return this.find({})
    .sort({timestamp: 'desc'}).skip(start).limit(20)
    .populate('twuser')
    .exec()

};

schema.statics.getSentimentScore = function(text){
  var deferred = Q.defer();

  alchemy.sentiment("text", text, {}, function(response) {
    console.log('come here?')
    var s = response["docSentiment"] ? response["docSentiment"]["score"] : 0
    if(s) {
      console.log('resolved?')
      deferred.resolve(s)
    }
    else deferred.reject('nonono')
    return s;
  });

  return deferred.promise;
};

schema.virtual('sentimentLabel').get(function(){
  // console.log('hit thisssss virutal')
  var s = this.sentiment.score;
  var l;

  if (s > 0.5 && s <= 1) l = "V.Positive"
  else if (s > 0 && s <= 0.5) l = "Positive"
  else if (s === 0) l = "Neutral"
  else if (s > -0.5 && s < 0) l = "Negative"
  else if (s >= -1 && s <= -0.5) l = "V.Negative"

  return l;
});

schema.pre('save', function(next){
  var self = this;

  Q(this.constructor.getSentimentScore(this.text)).then(function(score){
    console.log('are you here', score)
    self.sentiment.score = score;
    self.sentiment.label = self.sentimentLabel;
    next();
  });

})

//SAVE PROPERLY
schema.method('updateResponse', function (status) {
    this.response.status = true;
    this.response.responseText.push(status);
    this.response.save()
    console.log('updated?CORRECT', this.response)

});

mongoose.model('Tweet', schema);
