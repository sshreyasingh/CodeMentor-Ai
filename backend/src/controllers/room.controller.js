const Room = require('../models/room.model');

exports.createRoom = async (req, res, next) => {
  try {
    const { roomId, name } = req.body;

    const existing = await Room.findOne({ roomId });
    if (existing) {
      return res.status(400).json({ message: 'Room ID already in use' });
    }

    const room = await Room.create({
      roomId,
      name,
      owner: req.user.id,
      participants: [req.user.id],
    });

    await room.populate(['owner', 'participants']);

    res.status(201).json({ room });
  } catch (error) {
    next(error);
  }
};

exports.joinRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const alreadyIn = room.participants.some(
      (p) => p.toString() === req.user.id
    );

    if (!alreadyIn) {
      room.participants.push(req.user.id);
      await room.save();
    }

    await room.populate(['owner', 'participants']);

    res.json({ room });
  } catch (error) {
    next(error);
  }
};

exports.leaveRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    room.participants = room.participants.filter(
      (p) => p.toString() !== req.user.id
    );

    if (room.participants.length === 0) {
      await Room.deleteOne({ _id: room._id });
      return res.json({ message: 'Room deleted — last participant left' });
    }

    if (room.owner.toString() === req.user.id) {
      room.owner = room.participants[0];
    }

    await room.save();
    await room.populate(['owner', 'participants']);

    res.json({ room });
  } catch (error) {
    next(error);
  }
};

exports.listRooms = async (_req, res, next) => {
  try {
    const rooms = await Room.find()
      .populate('owner', 'name avatar')
      .populate('participants', 'name avatar')
      .sort('-createdAt');

    res.json({ rooms, count: rooms.length });
  } catch (error) {
    next(error);
  }
};

exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findOne({ roomId: req.params.roomId })
      .populate('owner', 'name avatar')
      .populate('participants', 'name avatar');

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    res.json({ room });
  } catch (error) {
    next(error);
  }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the room owner can delete this room' });
    }

    await Room.deleteOne({ _id: room._id });

    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    next(error);
  }
};
