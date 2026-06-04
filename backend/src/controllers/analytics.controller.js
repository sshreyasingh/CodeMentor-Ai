const Review = require('../models/review.model');
const Room = require('../models/room.model');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get total reviews count
    const totalReviews = await Review.countDocuments({ user: userId });

    // Get unique rooms the user has participated in (as owner or participant)
    const roomsAsOwner = await Room.countDocuments({ owner: userId });
    const roomsAsParticipant = await Room.countDocuments({
      participants: userId,
      owner: { $ne: userId },
    });
    const totalCollaborations = roomsAsOwner + roomsAsParticipant;

    // Get all user's reviews for score calculation
    const userReviews = await Review.find({ user: userId });

    // Calculate average code quality score (based on complexity readability)
    let codeQualityScore = 0;
    let securityScore = 0;

    if (userReviews.length > 0) {
      const totalQuality = userReviews.reduce((sum, review) => {
        const readability = review.complexity?.readability || 0;
        return sum + (readability * 10); // Convert 1-10 to percentage
      }, 0);
      codeQualityScore = Math.round(totalQuality / userReviews.length);

      // Calculate security score based on security issues found
      const totalSecurityIssues = userReviews.reduce(
        (sum, review) => sum + (review.security?.length || 0),
        0
      );
      // Fewer issues = higher score (max 100)
      securityScore = Math.max(0, 100 - totalSecurityIssues * 5);
    }

    // Get recent rooms with activity
    const recentRooms = await Room.find({
      $or: [{ owner: userId }, { participants: userId }],
    })
      .populate('owner', 'name avatar')
      .populate('participants', 'name avatar')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Format rooms for dashboard
    const formattedRooms = recentRooms.map((room) => ({
      id: room._id,
      roomId: room.roomId,
      name: room.name,
      language: 'Mixed', // Could be enhanced later
      participants: room.participants.length + 1, // +1 for owner
      isOwner: room.owner._id.toString() === userId,
      createdAt: room.createdAt,
    }));

    res.json({
      totalReviews,
      totalCollaborations,
      roomsOwned: roomsAsOwner,
      codeQualityScore,
      securityScore,
      recentRooms: formattedRooms,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAnalyticsStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all user reviews
    const userReviews = await Review.find({ user: userId }).sort({ createdAt: 1 });

    // Calculate stats
    const totalReviews = userReviews.length;

    // Count total bugs found
    const totalBugs = userReviews.reduce(
      (sum, review) => sum + (review.bugs?.length || 0),
      0
    );

    // Calculate average quality score
    let avgQualityScore = 0;
    if (totalReviews > 0) {
      const totalScore = userReviews.reduce((sum, review) => {
        const readability = review.complexity?.readability || 0;
        return sum + readability * 10;
      }, 0);
      avgQualityScore = Math.round(totalScore / totalReviews);
    }

    // Get active rooms count
    const activeRooms = await Room.countDocuments({
      $or: [{ owner: userId }, { participants: userId }],
    });

    // Calculate bug severity breakdown
    const bugSeverity = { high: 0, medium: 0, low: 0 };
    userReviews.forEach((review) => {
      review.bugs?.forEach((bug) => {
        if (bug.severity) {
          bugSeverity[bug.severity] = (bugSeverity[bug.severity] || 0) + 1;
        }
      });
    });

    // Calculate detailed metrics (average across all reviews)
    const metrics = {
      codeQuality: 0,
      security: 0,
      maintainability: 0,
      testCoverage: 0,
      documentation: 0,
      lintingCompliance: 0,
    };

    if (totalReviews > 0) {
      // Code quality from readability
      metrics.codeQuality = Math.round(
        userReviews.reduce((sum, r) => sum + (r.complexity?.readability || 0) * 10, 0) /
          totalReviews
      );

      // Security from number of issues (fewer = better)
      const avgSecurityIssues =
        userReviews.reduce((sum, r) => sum + (r.security?.length || 0), 0) / totalReviews;
      metrics.security = Math.max(0, Math.round(100 - avgSecurityIssues * 10));

      // Maintainability from cyclomatic complexity (lower = better)
      const avgComplexity =
        userReviews.reduce((sum, r) => sum + (r.complexity?.cyclomaticComplexity || 0), 0) /
        totalReviews;
      metrics.maintainability = Math.max(0, Math.round(100 - avgComplexity * 5));

      // Documentation score based on missing docs
      const avgDocIssues =
        userReviews.reduce((sum, r) => sum + (r.documentation?.length || 0), 0) /
        totalReviews;
      metrics.documentation = Math.max(0, Math.round(100 - avgDocIssues * 15));

      // Test coverage and linting - estimated from code quality
      metrics.testCoverage = Math.round(metrics.codeQuality * 0.85);
      metrics.lintingCompliance = Math.round(metrics.codeQuality * 0.95);
    }

    // Generate trend data (last 8 reviews or weeks)
    const trendData = [];
    const reviewsForTrend = userReviews.slice(-8);
    reviewsForTrend.forEach((review, index) => {
      const score = (review.complexity?.readability || 0) * 10;
      trendData.push({
        week: `W${index + 1}`,
        score: Math.round(score),
      });
    });

    // Fill remaining weeks with 0 if less than 8 reviews
    while (trendData.length < 8) {
      trendData.unshift({ week: `W${trendData.length + 1}`, score: 0 });
    }

    // Get recent rooms for activity
    const recentRooms = await Room.find({
      $or: [{ owner: userId }, { participants: userId }],
    })
      .sort({ updatedAt: -1 })
      .limit(10);

    res.json({
      totalReviews,
      totalBugs,
      avgQualityScore,
      activeRooms,
      bugSeverity,
      metrics,
      trendData,
      recentRooms: recentRooms.map((r) => ({
        id: r._id,
        name: r.name,
        createdAt: r.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};

exports.getRecentActivity = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get recent reviews
    const recentReviews = await Review.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('language createdAt bugs security');

    // Get recent rooms
    const recentRooms = await Room.find({
      $or: [{ owner: userId }, { participants: userId }],
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'name');

    res.json({
      recentReviews: recentReviews.map((r) => ({
        id: r._id,
        type: 'review',
        language: r.language,
        bugsFound: r.bugs?.length || 0,
        securityIssues: r.security?.length || 0,
        date: r.createdAt,
      })),
      recentRooms: recentRooms.map((r) => ({
        id: r._id,
        type: 'room',
        name: r.name,
        isOwner: r.owner._id.toString() === userId,
        date: r.createdAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};
