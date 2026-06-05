const passport = require('../config/passport');
const env = require('../config/env');

exports.githubAuth = passport.authenticate('github', {
  scope: ['user:email'],
});

exports.githubCallback = (req, res, next) => {
  passport.authenticate('github', { failureRedirect: `${env.clientUrl}/login` }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${env.clientUrl}/login`);

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);

      req.session.save((_saveErr) => {
        return res.redirect(`${env.clientUrl}/dashboard`);
      });
    });
  })(req, res, next);
};

exports.getMe = (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ user: req.user });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie('codementor.sid', {
        httpOnly: true,
        secure: env.nodeEnv === 'production',
        sameSite: env.nodeEnv === 'production' ? 'none' : 'lax',
      });
      res.json({ message: 'Logged out' });
    });
  });
};
