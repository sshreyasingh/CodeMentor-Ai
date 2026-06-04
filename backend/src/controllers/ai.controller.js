const aiService = require('../services/ai.service');

exports.chat = async (req, res, next) => {
  try {
    const { code, language, question, history } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ reply: 'Please provide a question.' });
    }

    if (question.length > 2000) {
      return res.status(400).json({ reply: 'Question is too long (max 2000 characters).' });
    }

    const result = await aiService.chatWithAI(
      code || '',
      language || 'javascript',
      question,
      history || []
    );

    res.json(result);
  } catch (error) {
    next(error);
  }
};
