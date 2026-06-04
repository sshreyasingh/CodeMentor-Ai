const router = require('express').Router();
const sessionController = require('../controllers/session.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, sessionController.createSession);
router.get('/', auth, sessionController.listSessions);
router.get('/:id', auth, sessionController.getSession);
router.patch('/:id', auth, sessionController.updateSession);

module.exports = router;
