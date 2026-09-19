const recentActivity = [];
let errorCount = 0;

const trackActivity = (req, res, next) => {
  const startedAt = Date.now();
  res.on('finish', () => {
    const activity = {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
      createdAt: new Date(),
    };
    recentActivity.unshift(activity);
    if (recentActivity.length > 20) recentActivity.pop();
    if (res.statusCode >= 500) errorCount += 1;
  });
  next();
};

const getSnapshot = () => ({
  uptimeSeconds: Math.floor(process.uptime()),
  memoryMb: Math.round(process.memoryUsage().rss / 1024 / 1024),
  errorCount,
  recentActivity,
});

module.exports = { trackActivity, getSnapshot };
