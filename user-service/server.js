require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const eurekaClient = require("./config/eureka");

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json());

// Import routes
const userRoutes = require("./routes/entities/userRoutes");
const userAuthRoutes = require("./routes/authentication/userRoutes");
const userValidationRoutes = require("./routes/internal/userValidationRoutes");

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'user-service',
    timestamp: new Date().toISOString()
  });
});

// Public routes (authentication)
app.use("/badPlan/auth", userAuthRoutes);

// Protected routes (user management)
app.use("/badPlan/users", userRoutes);

// Internal routes (service-to-service communication)
app.use("/internal", userValidationRoutes);

// Start Eureka client
eurekaClient.start((error) => {
  if (error) {
    console.error('Error connecting to Eureka:', error);
  } else {
    console.log('✓ Successfully registered with Eureka Server');
  }
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down user service...');
  eurekaClient.stop(() => {
    console.log('✓ Deregistered from Eureka');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`User Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('========================================');
});
