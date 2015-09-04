'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Tweet = mongoose.model('Tweet');

module.exports = router;

//twitter module
var Twit = require('twit');
var twconfig = require('../../../env').TWITTERAPI;
var twit = new Twit(twconfig);

//sentiment analysis module
var Alchemy = require('../../alchemy-api');
var alchemy = new Alchemy();

//stream tweets (+sentiment)
//save to db -> return instance
//emit to client (react comp)
//check if 1000. hit limit msg

process.nextTick(function() {
  var io = require('../../../io')();
  io.on('connection', function (socket) {
      var keyword = 'lalalalallalala'; //edit keyword here
      var stream = twit.stream('statuses/filter', { track: "#"+keyword });

      stream.on('tweet', function (tweet) {

          // var t = {
          //   twid:
          //   hashtag: keyword,
          //   createdAt: tweet.created_at.slice(0,19),
          //   active: false,
          //   text:
          //   sentimentScore:
          //   twuser:
          //   otherHashtag:
          // };

          // var u = {
          //     userid:
          //     screenName:
          //     name:
          //     location:
          //     createdAt:
          //     favorites:
          //     followers:
          //     friends:
          //     statuses:
          //     description:
          //     tweets:
          //     sentiment.score:
          // };

          // console.log(tweet.text);

          alchemy.sentiment("text", tweet.text, {}, function(response) {
            // if undefined:
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
            t.sentimentScore = response["docSentiment"]["score"];
            if (t.sentimentScore === undefined) t.sentimentScore = 0;

            socket.emit('sentiment', tweet);
          });
      })

  });
})


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
