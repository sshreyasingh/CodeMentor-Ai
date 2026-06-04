const router = require('express').Router();
const reviewController = require('../controllers/review.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, reviewController.reviewCode);

module.exports = router;
