'use strict';

var router = require('express').Router();
module.exports = router;
var request = require('request');
// var io = require('../../../io')();

//Twitter API----------------------------------------------------------
var Twit = require('twit');
var client = new Twit({
  consumer_key: 'Lpc5r8Br4Fp6bVLJRXqM7GGMR',
  consumer_secret: 'XktbH52B5znLyBn5IfuowidlTkYySqvyz7BFXEFCTVloCgRw8T',
  access_token: '1438719499-EQUC2lVp3oS2CjcNJmTwW0P0f4vYlbf1yPaWgrh',
  access_token_secret: 'kCgv6LZBYcMJpC7CtctubKfPkrR6bEOV8fJnbi14cZdP7'
});

//AlchemyAPI----------------------------------------------------------
var AlchemyAPI = require('./alchemyapi.js');
var alchemyapi = new AlchemyAPI();

//Firebase------------------------------------------------------------
var Firebase = require('firebase');

// listen to tweet streams----------------------------------------------------
// use socket to pass keyword for tracker

process.nextTick(function() {
  var io = require('../../../io')();
  io.on('connection', function (socket) {

      var stream = client.stream('statuses/filter', { track: '#smedo' })
      var tweet = {};

      stream.on('tweet', function (tweet) {
        console.log(tweet);
        tweet.time = Date.now();
        tweet.priority = null;
        tweet.reply = {name: null, text: null};
        tweet.created_at = tweet.created_at.slice(0,19);
        tweet.sentiment = {};

        alchemyapi.sentiment("text", tweet.text, {}, function(response) {

          if (response["docSentiment"] === undefined) {
            var sign = Math.floor(Math.random());
            var score = Math.random();
            score = parseFloat(score.toFixed(4));
            if (sign === 0) score=-score;

            if (score > 0) {
              tweet.sentiment.type = 'positive';
            }
            else if (score === 0) {
              tweet.sentiment.type = 'neutral';
            }
            else {
              tweet.sentiment.type = 'negative';
            }
            tweet.sentiment.score = score;
          }
          else if (response["docSentiment"]["type"] === undefined){
            tweet.sentiment.type = "neutral";
            tweet.sentiment.score = 0;
          }
          else if (response["docSentiment"]["score"] === undefined){
            tweet.sentiment.type = response["docSentiment"]["type"];
            tweet.sentiment.score = 0;
          }
          else {
            tweet.sentiment.type = response["docSentiment"]["type"];
            tweet.sentiment.score = response["docSentiment"]["score"];
          }



          //calculating data priority
          var w = {
            timePast: 0.00000000000555,
            tweetSentiment: 3,
            followers: 2
          }

          var sentiScore = null;

          if(tweet.sentiment.score < 0) {
            sentiScore = -tweet.sentiment.score;
          } else {
            sentiScore = tweet.sentiment.score;
          }

          var score =
          + w.tweetSentiment * sentiScore
          + w.followers * tweet.user.followers_count
          - w.timePast * tweet.time;

          tweet.priority = -score;

          console.log('sentiments', tweet.text)

          //do i broadcast emit?
          socket.emit('sentiment', tweet);

        });

        // priorityScore : since, *sentiScore, followers, satisfaction, pastTweets

      })

  });
})


//Look up user info!!!!!------------------------------------------------------
// client.get('users/lookup', {user_id: '50933451'}, function(error, tweets, response){
//   if(error) throw error;
//   console.log('mentions', tweets);  // The favorites.
//   //tweets[0].id / screen_name / location / description / followers_count
// http://twitter.com/ + screen_name
//
// });

//--------------------------------------------------------------------

router.get('/getPastMentions', function (req, res, next) {

  client.get('statuses/mentions_timeline', function(error, tweets, response){
    console.log('get mentions');
    tweets.sentiment = getSentiment(tweets.text);
    console.log('get mentions', tweets.sentiment);
    if(error) throw error;
    res.send(tweets);
  });

  //tweets[0].created_at , id, id_str, text
  //in_reply_to_status_id, in_reply_to_user_id, in_reply_to_screen_name
  //tweets[0].user.id / user.id_str / user.name / user.screen_name / user.profile_image_url

});

router.post('/postStatus', function (req, res) {

  client.post('statuses/update', { status: req.body.status }, function(err, data, response) {
      console.log('err', err);
  })

})


// Search || cannot retrieve user info
// client.get('search/tweets', { q: 'leeeuniz since:2013-10-10' , count: 100 },function(error, tweets, response){
//   if(error) throw error;
//   console.log('search', tweets);  // The favorites.
//
// });
// //Sentiment analysis----------------------------------------------------
// function getSentiment (text) {
//   // var myText = text;
//   var sentiment={type: null, score: null};
//
//   alchemyapi.sentiment("text", text, {}, function(response) {
//     sentiment.type = response["docSentiment"]["type"];
//     sentiment.score = response["docSentiment"]["score"];
//     if (sentiment.score === undefined) sentiment.score = 0;
//     console.log('sentiments', sentiment)
//     return sentiment;
//
//   });
//
//
// }
//----------------------
// var url = "https://api.twitter.com/1.1/statuses/mentions_timeline.json"
// var query = {count: 2, since_id: 14927799}
//
// request({url: url, qs: query}, function(err, response, body) {
//
//   if(err) {
//     console.log('err', err);
//     throw error;
//   }
//
//   body = JSON.parse(body);
//   console.log('body', body)
//
//   res.send(body)
// })
