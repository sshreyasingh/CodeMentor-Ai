const passport = require('../config/passport');

exports.githubAuth = passport.authenticate('github', {
  scope: ['user:email'],
});

exports.githubCallback = (req, res, next) => {
  passport.authenticate('github', { failureRedirect: `${process.env.CLIENT_URL || 'http://localhost:5173'}/login` }, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login`);

    req.logIn(user, (loginErr) => {
      if (loginErr) return next(loginErr);
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/dashboard`);
    });
  })(req, res, next);
};

exports.getMe = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  res.json({ user: req.user });
};

exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((destroyErr) => {
      if (destroyErr) return next(destroyErr);
      res.clearCookie('connect.sid');
      res.json({ message: 'Logged out' });
    });
  });
};
