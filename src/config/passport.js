const passport = require('passport');
const User = require('../models/User');

require('./googleStrategy')(passport);
require('./facebookStrategy')(passport);
require('./githubStrategy')(passport);
require('./linkedinStrategy')(passport);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;