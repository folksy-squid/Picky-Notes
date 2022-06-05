if (process.env.NODE_ENV === 'test') {
  var keys = {FACEBOOK_APP_ID: 'haha', FACEBOOK_APP_SECRET: 'no secrets for you'};
} else {
  var keys = require('../../keys').facebook;
}

let callbackURL = 'http://localhost:3000/auth/facebook/callback';

if (process.env.NODE_ENV == 'production') {
  callbackURL = 'http://54.148.49.146/auth/facebook/callback';
}

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

/****** REQUIRE DATABASE ******/
var {db, User} = require('../database/db-config.js');
/****************** PASSPORT CONFIG ***************/
passport.use(new FacebookStrategy({
  clientID: keys.FACEBOOK_APP_ID,
  clientSecret: keys.FACEBOOK_APP_SECRET,
  callbackURL: callbackURL,
  profileFields: ['id', 'name', 'picture.type(large)', 'email', 'gender']
}, function(accessToken, refreshToken, profile, done) {
  let newUser = {
    facebookId: profile.id,
    name: profile._json.first_name + ' ' + profile._json.last_name,
    email: profile.emails[0].value,
    pictureUrl: profile.photos[0].value,
    gender: profile.gender
  };
  User.findOrCreate({
    where: newUser
  })
  .then( (user) => {
    done(null, user);
  })
  .catch( (err) => {
    console.log(err)
    done(err);
  });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
