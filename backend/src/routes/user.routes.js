const router = require('express').Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');

router.get('/profile/:id', auth, userController.getProfile);
router.patch('/profile', auth, userController.updateProfile);
router.get('/', auth, userController.listUsers);

module.exports = router;
