// config/auth.js

// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : process.env.FACEBOOK_APP_ID, // your App ID
        'clientSecret'  : process.env.FACEBOOK_SECRET, // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : process.env.TWITTER_CONSUMER_KEY,
        'consumerSecret'    : process.env.TWITTER_CONSUMER_SECRET,
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : process.env.GOOGLE_CLIENT_ID,
        'clientSecret'  : process.env.GOOGLE_CLIENT_SECRET,
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
