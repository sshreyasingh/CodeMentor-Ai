const router = require('express').Router();
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');

router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);
router.get('/me', auth, authController.getMe);
router.post('/logout', auth, authController.logout);

module.exports = router;
