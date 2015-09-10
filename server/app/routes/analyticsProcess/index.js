'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Tweet = mongoose.model('Tweet');
var TwitterUser = mongoose.model('TwitterUser');
var Stats = mongoose.model('Stats');

module.exports = router;

process.nextTick(function() {
  var io = require('../../../io')();
  io.on('connection', function (socket) {

    // socket.on('newTweet', function(data){
    //     console.log('hey i receive it too', data)
    //
    //
    // });

  });
});
