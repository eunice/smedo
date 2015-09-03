/*
    These environment variables are not hardcoded so as not to put
    production information in a repo. They should be set in your
    heroku (or whatever VPS used) configuration to be set in the
    applications environment, along with NODE_ENV=production

 */

module.exports = {
    "DATABASE_URI": process.env.MONGOLAB_URI,
    "SESSION_SECRET": process.env.SESSION_SECRET,
    "TWITTERAPI": {
        "consumer_key": process.env.TWITTERAPI.consumer_key,
        "consumer_secret": process.env.TWITTERAPI.consumer_secret,
        "access_token": process.env.TWITTERAPI.access_token,
        "access_token_secret": process.env.TWITTERAPI.access_token_secret
    }
};
