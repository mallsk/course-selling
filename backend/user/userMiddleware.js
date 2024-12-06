import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: '.././.env' });
const JWT_SECRET = process.env.JWT_SECRET;

export async function userMiddleware(req, res, next) {
    try {
      const bearerToken = req.headers['authorization'];
  
      // Check if Authorization header is present
      if (!bearerToken) {
        return res.status(403).json({
          message: 'Access Denied: No authorization token provided',
        });
      }
  
      // Extract token from 'Bearer <token>'
      const token = bearerToken.split(' ')[1];
  
      if (!token) {
        return res.status(401).json({
          message: 'Token missing, please login again',
        });
      }
  
      // Verify the token
      try {
        const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
  
        // Attach userId to the request object for further use
        req.userId = verifyToken.userId;
  
        // Proceed to the next middleware or route handler
        return next();
      } catch (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({
            message: 'Token has expired. Please log in again.',
          });
        } else {
          return res.status(401).json({
            message: 'Invalid token. Please log in again.',
          });
        }
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        message: 'Something went wrong, please try again later.',
      });
    }
  }