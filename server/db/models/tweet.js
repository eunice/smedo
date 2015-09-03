'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    twid: String,
    hashtag: String,
    createdAt: String,
    timestamp: {type: Date, default: Date.now},
    active: Boolean,
    text: String,
    sentimentType: {
      type: String,
      enum:['V.Positive','Positive','V.Negative','Negative','Neutral']
    },
    sentimentScore: Number,
    twuser: {
      type: mongoose.Schema.Types.ObjectId, ref: 'TwitterUser'
    },
    otherHashtag: [String],
    response: Boolean,
    responseText: String
});

// var generateSalt = function () {
//     return crypto.randomBytes(16).toString('base64');
// };
//
// var encryptPassword = function (plainText, salt) {
//     var hash = crypto.createHash('sha1');
//     hash.update(plainText);
//     hash.update(salt);
//     return hash.digest('hex');
// };
//
// schema.pre('save', function (next) {
//
//     if (this.isModified('password')) {
//         this.salt = this.constructor.generateSalt();
//         this.password = this.constructor.encryptPassword(this.password, this.salt);
//     }
//
//     next();
//
// });
//
// schema.statics.generateSalt = generateSalt;
// schema.statics.encryptPassword = encryptPassword;
//
// schema.method('correctPassword', function (candidatePassword) {
//     return encryptPassword(candidatePassword, this.salt) === this.password;
// });

mongoose.model('Tweet', schema);
