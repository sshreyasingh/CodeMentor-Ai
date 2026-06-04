const router = require('express').Router();
const executionController = require('../controllers/execution.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, executionController.executeCode);

module.exports = router;
