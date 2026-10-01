const User = require('./user-model');

async function adminMiddleware(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(401).json({
        message: 'User not found'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        message: 'Admin access required'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
}

module.exports = adminMiddleware;