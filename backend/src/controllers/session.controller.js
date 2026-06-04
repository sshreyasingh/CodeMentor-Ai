const Session = require('../models/session.model');

exports.createSession = async (req, res, next) => {
  try {
    const session = await Session.create({
      ...req.body,
      student: req.user.id,
    });
    res.status(201).json({ session });
  } catch (error) {
    next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate('mentor', 'name email avatar')
      .populate('student', 'name email avatar');

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

exports.listSessions = async (req, res, next) => {
  try {
    const filter = {
      $or: [
        { mentor: req.user.id },
        { student: req.user.id },
      ],
    };
    if (req.query.status) filter.status = req.query.status;

    const sessions = await Session.find(filter)
      .populate('mentor', 'name email avatar')
      .populate('student', 'name email avatar')
      .sort('-createdAt');

    res.json({ sessions, count: sessions.length });
  } catch (error) {
    next(error);
  }
};

exports.updateSession = async (req, res, next) => {
  try {
    const { status } = req.body;
    const update = {};
    if (status === 'completed' || status === 'cancelled') {
      update.status = status;
      update.endedAt = new Date();
    }

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, mentor: req.user.id },
      update,
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: 'Session not found or unauthorized' });
    }
    res.json({ session });
  } catch (error) {
    next(error);
  }
};
