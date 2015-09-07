'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var Tweet = mongoose.model('Tweet');
var TwitterUser = mongoose.model('TwitterUser');
var Overview = mongoose.model('Overview');

module.exports = router;

process.nextTick(function() {
  var io = require('../../../io')();
  io.on('connection', function (socket) {

    

  });
});
