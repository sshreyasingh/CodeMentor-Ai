const executionService = require('../services/execution.service');

exports.executeCode = async (req, res, next) => {
  try {
    const { code, language, stdin } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ message: 'Code is required' });
    }

    if (!language || typeof language !== 'string') {
      return res.status(400).json({ message: 'Language is required' });
    }

    const MAX_CODE_LENGTH = 100000;
    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        message: `Code exceeds maximum length of ${MAX_CODE_LENGTH} characters`,
      });
    }

    const result = await executionService.executeCode(code, language, stdin || '');

    res.json(result);
  } catch (error) {
    next(error);
  }
};
