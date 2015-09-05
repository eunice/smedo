'use strict';
var mongoose = require('mongoose');
var Q = require('q');

var schema = new mongoose.Schema({
    userid: String,
    screenName: String,
    name: String,
    profileimg: String,
    location: String,
    createdAt: String,
    favorites: Number,
    followers: Number,
    friends: Number,
    statuses: Number,
    description: String
});

schema.statics.checkAndCreate = function(u, keyword, cb){
  // console.log('user checking and creating')
  var self = this;
  return this.findOne({userid: u.userid}).exec().then(function(user){
    if (!user){

      mongoose.model('Overview').findOne({keyword: keyword}).exec().then(function(file){
        // console.log('i am incre unique users!!')
        file.numUniqueUsers++
        file.save()
      })

      return self.create(u);

    } else {
      // console.log('user checking and creating222')
      user = u;
      return user.save(); //NEED TO TEST THIS
    }
  },cb);
};

mongoose.model('TwitterUser', schema);
