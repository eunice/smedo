'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Tweet = mongoose.model('Tweet');
var TwitterUser = mongoose.model('TwitterUser');

module.exports = router;

//twitter module
var Twit = require('twit');
var twconfig = require('../../../env').TWITTERAPI;
var twit = new Twit(twconfig);

process.nextTick(function() {
  var io = require('../../../io')();
  io.on('connection', function (socket) {
      //add keyword
      var keyword = 'coffee';

      //create overview page for new keyword
      console.log('hihihi?')

      //stream tweet
      var stream = twit.stream('statuses/filter', { track: keyword});
      stream.on('tweet', function (data) {
          console.log('!!!! im coming')

          var t = {
              twid: data.id_str,
              keyword: keyword,
              createdAt: data.created_at.slice(0,19),
              active: false,
              text: data.text,
              response: {status: false}
          };

          var u = {
              userid: data.user.id_str,
              screenName: data.user.screen_name,
              name: data.user.name,
              profileimg: data.user.profile_image_url,
              location: data.user.location,
              createdAt: data.user.created_at.slice(0,19),
              favorites: data.user.favourites_count,
              followers: data.user.followers_count,
              friends: data.user.friends_count,
              statuses: data.user.statuses_count,
              description: data.user.description
          };

          console.log('holdingggg',Tweet.checkIfDuplicate(data.id_str))

          //check

          Tweet.checkIfDuplicate(data.id_str).then(function(exist){
            if (!exist) {
              TwitterUser.checkAndCreate(u,keyword)
                .then(function(user){
                  // console.log('twitter user created')
                  t.twuser = user._id;
                })
                .then(function(){
                  Tweet.create(t).then(function(tweet){
                    console.log('this is what TWEET created')
                    // io.emit('tweet',tweet)
                  });
                })
                // .then(function(){}) //overview handling
            }
          });

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
