const router = require('express').Router();
const chatController = require('../controllers/chat.controller');
const auth = require('../middleware/auth.middleware');

router.get('/:sessionId/messages', auth, chatController.getMessages);

module.exports = router;
