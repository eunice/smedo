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

process.nextTick(function() {
  var io = require('../../../io')();
  io.on('connection', function (socket) {
      //add keyword
      var keyword = 'coffee';

      //create overview page for new keyword
      Stats.checkAndCreate(keyword).then(function(file){
        console.log('hi stats', file)
      })

      //stream tweet
      var stream = twit.stream('statuses/filter', { track: keyword});
      var previous = "";
      stream.on('tweet', function (data) {
          console.log('anyone?')
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

          //check if duplicate
          if (previous !== data.text) {
                previous = data.text;

                //adding tweet to db
                Tweet.create(t)
                .then(function(tweet){

                    //creating twitter user
                    return TwitterUser.checkAndCreate(u, keyword, tweet.sentiment.score)
                      .then(function(user){
                          console.log('hello new user', user)
                          tweet.twuser = user._id;
                          tweet.save();
                          return tweet;
                      });

                })
                .then(function(tweet){
                      return Tweet.getTweetById(tweet._id)
                  })
                .then(function(tweet){
                    console.log('this is what TWEET created',tweet)
                    //socket emit
                    socket.emit('newTweet',tweet);
                    //stats


                })

          }

      });
  });
})
