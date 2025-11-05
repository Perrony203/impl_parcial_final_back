require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const eurekaClient = require('./config/eureka');

// Import proxy routes
const configureProxyRoutes = require('./routes/proxyRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware configuration
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check endpoint (before proxy routes to avoid conflicts)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    service: 'gateway-service',
    timestamp: new Date().toISOString()
  });
});

// Basic info endpoint (before proxy routes to avoid conflicts)
app.get('/', (req, res) => {
  res.json({
    message: 'API Gateway Service',
    version: '1.0.0',
    status: 'running'
  });
});

// Configure proxy routes to microservices
configureProxyRoutes(app, eurekaClient);

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
  console.log('\nShutting down gateway service...');
  eurekaClient.stop(() => {
    console.log('✓ Deregistered from Eureka');
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log('========================================');
  console.log(`Gateway Service running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('========================================');
});
