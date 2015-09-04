'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Tweet = mongoose.model('Tweet');
var TwitterUer = mongoose.model('TwitterUser');

module.exports = router;

//twitter module
var Twit = require('twit');
var twconfig = require('../../../env').TWITTERAPI;
var twit = new Twit(twconfig);

//check if 1000. hit limit msg
process.nextTick(function() {
  var io = require('../../../io')();
  io.on('connection', function (socket) {
      var keyword = 'coffee'; //edit keyword here
      var stream = twit.stream('statuses/filter', { track: keyword });

      //stream tweet
      stream.on('tweet', function (data) {
          console.log('!!!!',data)

          //create + save doc to db
          var t = {
              twid: data.id_str,
              hashtag: keyword,
              createdAt: data.created_at.slice(0,19),
              active: false,
              text: data.text,
              response: {status: false}
          };

          var u = {
              userid: data.user.id_str,
              profileimg: profile_image_url,
              screenName: data.user.screen_name,
              name: data.user.name,
              location: data.user.location,
              createdAt: data.user.created_at,
              favorites: data.user.favorites_count,
              followers: data.user.followers_count,
              friends: data.user.friends_count,
              statuses: data.user.statuses_count,
              description: data.user.description
          };

          // t.save(function(err){
          //   if (err) console.log(err.message);
          //   io.emit('tweet',t)
          // });
          // return instance + emit to client (react comp)

      });

  });
})
          // if sentiment undefined:
          // if (response["docSentiment"] === undefined) {
          //   var sign = Math.floor(Math.random());
          //   var score = Math.random();
          //   score = parseFloat(score.toFixed(4));
          //   if (sign === 0) score=-score;
          //
          //   if (score > 0) {
          //     tweet.sentiment.type = 'positive';
          //   }
          //   else if (score === 0) {
          //     tweet.sentiment.type = 'neutral';
          //   }
          //   else {
          //     tweet.sentiment.type = 'negative';
          //   }
          //   tweet.sentiment.score = score;
          // }
          // else if (response["docSentiment"]["type"] === undefined){
          //   tweet.sentiment.type = "neutral";
          //   tweet.sentiment.score = 0;
          // }
          // else if (response["docSentiment"]["score"] === undefined){
          //   tweet.sentiment.type = response["docSentiment"]["type"];
          //   tweet.sentiment.score = 0;
          // }
          // else {
          // }

router.post('/postStatus', function (req, res) {

  client.post('statuses/update', { status: req.body.status }, function(err, data, response) {
      console.log('err', err);
  })

})
