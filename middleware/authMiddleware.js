// middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import db from '../models/index.js'; // Import db to access models

const { Officer } = db;

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach officer to the request object (excluding password)
      req.officer = await Officer.findByPk(decoded.id, {
        attributes: { exclude: ['password'] } // Exclude password from the returned object
      });

      if (!req.officer) {
        return res.status(401).json({ message: 'Not authorized, officer not found' });
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protect };
