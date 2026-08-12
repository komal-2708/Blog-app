const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const authorization = req.get('Authorization') || '';
  const [scheme, token] = authorization.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Authentication is required.'
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      error: 'JWT_SECRET is missing from the .env file.'
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({
      error: 'Your session is invalid or expired. Please log in again.'
    });
  }
}

module.exports = { requireAuth };