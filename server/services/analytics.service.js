const Analytics = require('../models/Analytics');

/**
 * Track a user query for analytics
 */
async function trackQuery(query, category, language, sessionId) {
  try {
    await Analytics.create({ query, category, language, sessionId });
  } catch (err) {
    console.error('Analytics tracking error:', err.message);
  }
}

/**
 * Get aggregated analytics: top categories and most asked queries
 */
async function getAnalyticsSummary() {
  try {
    const categoryStats = await Analytics.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const topQueries = await Analytics.aggregate([
      { $group: { _id: '$query', count: { $sum: 1 }, category: { $first: '$category' } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    const last7Days = await Analytics.aggregate([
      { $match: { date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return { categoryStats, topQueries, last7Days };
  } catch (err) {
    console.error('Analytics fetch error:', err.message);
    return { categoryStats: [], topQueries: [], last7Days: [] };
  }
}

module.exports = { trackQuery, getAnalyticsSummary };
