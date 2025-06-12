const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }
  // Check for token in Authorization header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ message: 'Not authorized to access this route' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from the token
    req.user = await User.findById(decoded.id).select('-password');
    
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};
