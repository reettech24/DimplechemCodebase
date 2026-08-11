const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, username: user.username, userrole:user.employeeRole?.role_id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES || '1d' } // Default expiration: 1 day
  );
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};
