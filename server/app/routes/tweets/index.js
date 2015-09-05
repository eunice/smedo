'use strict';
var router = require('express').Router();
var mongoose = require('mongoose');
var JSX = require('node-jsx').install();
var React = require('react');

var Tweet = mongoose.model('Tweet');
var TwitterUser = mongoose.model('TwitterUser');
var Overview = mongoose.model('Overview');

module.exports = router;

//twitter module
var Twit = require('twit');
var twconfig = require('../../../env').TWITTERAPI;
var twit = new Twit(twconfig);

router.get('/getTweets', function(req,res,next) {

});

router.post('/postStatus', function (req, res, next) {
  twit.post('statuses/update', { status: req.body.status }, function(err, data, response) {
      console.log('err', err);
  });
});
