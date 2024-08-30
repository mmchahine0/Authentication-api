const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: `${process.env.NGROK_URL}/api/auth/facebook/callback`,
    profileFields: ['id', 'emails', 'name']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Access token: ", accessToken);

      let user = await User.findOne({ facebookId: profile.id });

      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.facebookId = profile.id;
          await user.save();
        } else {
          user = new User({
            facebookId: profile.id,
            email: profile.emails[0].value,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            username: profile.emails[0].value.split('@')[0],
            isVerified: true
          });
          await user.save();
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('Error in Facebook Strategy:', error);
      return done(error, null);
    }
  }));
}