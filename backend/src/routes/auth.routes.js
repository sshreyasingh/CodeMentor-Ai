const router = require('express').Router();
const authController = require('../controllers/auth.controller');

router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);
router.get('/me', authController.getMe);
router.post('/logout', authController.logout);

module.exports = router;
