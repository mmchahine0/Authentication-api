const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
  passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.NGROK_URL}/api/auth/github/callback`
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      console.log("Access token: ", accessToken);

      let user = await User.findOne({ githubId: profile.id });

      if (!user) {
        user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
          user.githubId = profile.id;
          await user.save();
        } else {
          user = new User({
            githubId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            username: profile.username,
            isVerified: true
          });
          await user.save();
        }
      }

      return done(null, user);
    } catch (error) {
      console.error('Error in GitHub Strategy:', error);
      return done(error, null);
    }
  }));
}