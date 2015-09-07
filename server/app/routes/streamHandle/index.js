'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Tweet = mongoose.model('Tweet');
var TwitterUser = mongoose.model('TwitterUser');
var Overview = mongoose.model('Overview');

module.exports = router;

//twitter module
var Twit = require('twit');
var twconfig = require('../../../env').TWITTERAPI;
var twit = new Twit(twconfig);

process.nextTick(function() {
  var io = require('../../../io')();
  io.on('connection', function (socket) {
      //add keyword
      var keyword = 'walalallalallala';

      //create overview page for new keyword
      console.log('hihihi?')

      //stream tweet
      var stream = twit.stream('statuses/filter', { track: keyword});
      var previous = "";
      stream.on('tweet', function (data) {

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
          if (previous != data.text) {
                previous = data.text;

                //adding tweet to db + socket emit
                TwitterUser.checkAndCreate(u,keyword)
                  .then(function(user){
                      t.twuser = user._id;
                      return Tweet.create(t)
                  })
                  .then(function(tweet){
                      return Tweet.getTweetById(tweet._id)
                  })
                  .then(function(tweet){
                      console.log('this is what TWEET created')
                      socket.emit('newTweet',tweet)

                  })

                //overview handling
          }

      });
  });
})
