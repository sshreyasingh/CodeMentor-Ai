const insightService = require('../services/insight.service');

exports.getInsights = async (req, res, next) => {
  try {
    const analysis = await insightService.updateInsights(req.user.id);
    const aiSummary = await insightService.getAIInsightSummary(req.user.id);

    res.json({
      ...analysis,
      aiSummary,
    });
  } catch (error) {
    next(error);
  }
};
