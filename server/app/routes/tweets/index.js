'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');

var Tweet = mongoose.model('Tweet');
var TwitterUser = mongoose.model('TwitterUser');
var Stats = mongoose.model('Stats');

module.exports = router;

//twitter module
var Twit = require('twit');
var twconfig = require('../../../env').TWITTERAPI;
var twit = new Twit(twconfig);

router.get('/getTweets', function(req, res, next) {
  //page,skip
  Tweet.getTweets(0,0).then(function(tweets){

      tweets.forEach(function(tweet){
        tweet.active = true;
        tweet.save();
      });
      res.send(tweets)
  }, next)

});

router.get('/getPage', function(req, res, next) {

  Tweet.getTweets(req.params.page, req.params.skip).then(function(tweets){
    res.send(tweets);
  })
});

router.post('/postStatus', function (req, res, next) {
    //?????????
    Tweet.getTweetById(req.body.id).then(function(tweet){
      console.log('tweet twid', tweet.twid)
      tweet.updateResponse(req.body.status);
    },next)

  // twit.post('statuses/update', { status: req.body.status }, function(err, data, response) {
  //     console.log('err', err);
  // });
});
