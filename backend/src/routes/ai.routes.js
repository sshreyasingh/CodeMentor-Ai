const router = require('express').Router();
const aiController = require('../controllers/ai.controller');
const auth = require('../middleware/auth.middleware');

router.post('/chat', auth, aiController.chat);

module.exports = router;
