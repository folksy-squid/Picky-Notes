if (process.env.NODE_ENV === 'test') {
  var keys = {facebook: {FACEBOOK_APP_ID: 'haha', FACEBOOK_APP_SECRET: 'no secrets for you'}};
} else {
  var keys = require('../../keys.js');
}
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

/****** REQUIRE DATABASE ******/
var {db, User} = require('../database/db-config.js');
/****************** PASSPORT CONFIG ***************/
passport.use(new FacebookStrategy({
  clientID: keys.facebook.FACEBOOK_APP_ID,
  clientSecret: keys.facebook.FACEBOOK_APP_SECRET,
  callbackURL: 'http://localhost:3000/auth/facebook/callback',
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
    console.log(err);
    done(err);
  });

    // User.findOrCreateUser(profile, function(error, user) {
    //   if (error) {
    //     return done(error);
    //   } else {
    //     done(null, {
    //       _facebookUniqueID: user._facebookUniqueID,
    //       firstname: user.firstname,
    //       lastname: user.lastname,
    //       picture: user.picture
    //     });
    //   }
    // });
}));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = passport;
