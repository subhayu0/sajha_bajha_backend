const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

const generateAccessToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role
  };
  return generateToken(payload);
};

const generateRefreshToken = (user) => {
  const payload = {
    id: user.id,
    type: 'refresh'
  };
  return generateToken(payload);
};

const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  generateAccessToken,
  generateRefreshToken,
  decodeToken
}; 