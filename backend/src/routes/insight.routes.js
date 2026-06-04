const router = require('express').Router();
const insightController = require('../controllers/insight.controller');
const auth = require('../middleware/auth.middleware');

router.get('/', auth, insightController.getInsights);

module.exports = router;
