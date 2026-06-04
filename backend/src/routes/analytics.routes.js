const router = require('express').Router();
const analyticsController = require('../controllers/analytics.controller');
const auth = require('../middleware/auth.middleware');

router.get('/dashboard', auth, analyticsController.getDashboardStats);
router.get('/stats', auth, analyticsController.getAnalyticsStats);
router.get('/activity', auth, analyticsController.getRecentActivity);

module.exports = router;
