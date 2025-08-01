
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
  console.log("authenticateToken called");
  console.log("Request path:", req.path);
  console.log("Request method:", req.method);
  
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return next();
  }
  
  // Skip token verification for public routes
  if (req.path === "/api/auth/login" || req.path.startsWith("/api/users") && req.method === 'POST') {
    console.log("Skipping authentication for public route");
    return next();
  }

  // Get full Authorization header for enhanced logging
  const authHeader = req.header("Authorization");
  console.log("Full Authorization header:", authHeader);

  // Extract token from Authorization header
  let token;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);
  } else {
    console.log("Authorization header malformed or missing Bearer prefix.");
  }

  if (!token) {
    console.log("No token provided");
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.secretkey);
    console.log("JWT verification successful");
    console.log("Decoded:", decoded);
    
    req.user = decoded; // Attach decoded payload to request object
    console.log("Decoded user object structure:", JSON.stringify(decoded, null, 2));
    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("JWT verification error:", err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired. Please login again." });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: "Invalid token. Please login again." });
    }
    
    return res.status(403).json({ message: "Token verification failed." });
  }
}
