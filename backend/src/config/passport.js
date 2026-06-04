const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/user.model');
const env = require('./env');

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

passport.use(
  new GitHubStrategy(
    {
      clientID: env.github.clientId,
      clientSecret: env.github.clientSecret,
      callbackURL: env.github.callbackUrl,
      scope: ['user:email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email =
          (profile.emails && profile.emails.length > 0)
            ? profile.emails[0].value
            : '';

        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          user = await User.create({
            githubId: profile.id,
            name: profile.displayName || profile.username,
            email,
            avatar: profile.photos?.[0]?.value || '',
          });
        } else {
          user.name = profile.displayName || profile.username;
          user.email = email || user.email;
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          await user.save();
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
