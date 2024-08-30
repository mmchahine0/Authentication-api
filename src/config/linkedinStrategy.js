const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: `${process.env.NGROK_URL}/api/auth/linkedin/callback`,
    scope: ['r_emailaddress', 'r_liteprofile']
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Access token: ", accessToken);

      let user = await User.findOne({ linkedinId: profile.id });

      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.linkedinId = profile.id;
          await user.save();
        } else {
          user = new User({
            linkedinId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            username: profile.emails[0].value.split('@')[0],
            isVerified: true
          });
          await user.save();
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('Error in LinkedIn Strategy:', error);
      return done(error, null);
    }
  }));
}