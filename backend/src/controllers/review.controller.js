const aiService = require('../services/ai.service');
const Review = require('../models/review.model');

exports.reviewCode = async (req, res, next) => {
  try {
    const { code, language } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Code is required' });
    }

    if (!language || typeof language !== 'string') {
      return res.status(400).json({ message: 'Language is required' });
    }

    const MAX_CODE_LENGTH = 20000;
    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        message: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`,
      });
    }

    const review = await aiService.reviewCode(code, language);

    if (!review.complexity?.error) {
      await Review.create({
        user: req.user.id,
        code,
        language,
        bugs: review.bugs || [],
        security: review.security || [],
        optimizations: review.optimizations || [],
        complexity: review.complexity || {},
        documentation: review.documentation || [],
      });
    }

    res.json(review);
  } catch (error) {
    next(error);
  }
};
