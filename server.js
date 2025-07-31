const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 6969;

require("dotenv").config();

// Import routes
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");


// Import database and models
const { sequelize } = require("./config/database");
// Import your models to ensure they're loaded
const Product = require("./models/Product");
// Import other models if you have them
// const User = require("./models/User");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);


// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Backend connected successfully!" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({ 
    message: "Something went wrong!",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Database sync and server start
const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
    
    // Sync database - this will create missing columns
    if (process.env.NODE_ENV === 'development') {
      // In development: alter existing tables to match models
      await sequelize.sync({ alter: true });
      console.log("🔄 Database synchronized with models (alter mode).");
    } else {
      // In production: only sync without altering
      await sequelize.sync();
      console.log("🔄 Database synchronized.");
    }
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

startServer();