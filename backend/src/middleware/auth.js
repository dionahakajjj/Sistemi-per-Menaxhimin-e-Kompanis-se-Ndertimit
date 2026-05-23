const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // Authorization header: Bearer <token>
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Qasja u refuzua. Mungon token-i.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token-i ka skaduar.', code: 'TOKEN_EXPIRED' });
    }
    return res.status(403).json({ message: 'Token-i nuk është i vlefshëm.' });
  }
};

const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'I paautorizuar.' });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Nuk keni privilegje të mjaftueshme për këtë veprim.' });
    }

    next();
  };
};

module.exports = {
  authenticateToken,
  authorize
};
