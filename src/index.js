
import express from "express";
import bodyParser from "body-parser";
import cors from "cors"; // <-- import CORS
import { db } from "./database/index.js";
import { userRouter, authRouter, productRouter, contactRouter, orderRouter, adminRoute } from "./route/index.js";
import dotenv from "dotenv";
import { authenticateToken } from "./middleware/token-middleware.js";
import router from "./route/uploadRoutes.js";
import { createUploadsFolder } from "./security/helper.js";
import { createAdminUser } from "./seeders/createAdminUser.js";

dotenv.config();

const app = express();
app.use('/uploads', express.static('uploads'));
const port = process.env.PORT || 5001;

// ✅ Enable CORS with specific options
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Frontend URLs
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON
app.use(bodyParser.json());

// Public routes
app.use("/api/auth", authRouter);
app.use("/api/product", productRouter); // Make product routes public
app.use("/api/contact", contactRouter); // Public route for contact form submission
app.use("/api/users", userRouter); // Make user creation public

// Protect routes below
app.use(authenticateToken);
app.use("/api/file", router);
app.use("/api/orders", orderRouter);
app.use("/api/admin", adminRoute); // Mount admin routes

// Protected contact routes (for admin)
app.use("/api/admin/contact", authenticateToken, (req, res, next) => {
  // Check if user is admin
  console.log('Admin check - User object:', req.user);
  
  // Handle different possible structures of the user object
  const isAdmin = 
    (req.user?.isAdmin) || 
    (req.user?.user?.isAdmin);
  
  console.log('Admin check - isAdmin value:', isAdmin);
  
  if (!req.user || !isAdmin) {
    console.log('Access denied: Not an admin');
    return res.status(403).json({ error: 'Access denied: Admin only' });
  }
  console.log('Admin access granted');
  next();
}, contactRouter);

// Create uploads folder
createUploadsFolder();

// Create default admin user on server start
createAdminUser();

// Start server
app.listen(port, function () {
  console.log(`Project running on port ${port}`);
  db();
});