const Message = require('../models/message.model');

exports.getMessages = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const { limit = 50, before } = req.query;

    const query = { session: sessionId };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate('sender', 'name avatar')
      .sort('-createdAt')
      .limit(parseInt(limit));

    res.json({ messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
};

exports.saveMessage = async (data) => {
  const message = await Message.create(data);
  return message.populate('sender', 'name avatar');
};
