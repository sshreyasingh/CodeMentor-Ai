const router = require('express').Router();
const roomController = require('../controllers/room.controller');
const auth = require('../middleware/auth.middleware');

router.post('/', auth, roomController.createRoom);
router.get('/', auth, roomController.listRooms);
router.get('/:roomId', auth, roomController.getRoom);
router.post('/:roomId/join', auth, roomController.joinRoom);
router.post('/:roomId/leave', auth, roomController.leaveRoom);
router.delete('/:roomId', auth, roomController.deleteRoom);

module.exports = router;
