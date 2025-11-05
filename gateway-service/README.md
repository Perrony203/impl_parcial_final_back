# Gateway Service

API Gateway Service with Eureka integration for microservices architecture.

## Prerequisites

- Node.js 18+
- Eureka Server running on port 8761
- npm or yarn

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
EUREKA_HOST=localhost
EUREKA_PORT=8761
```

## Running the Service

### Development mode (with nodemon)
```bash
npm run dev
```

### Production mode
```bash
npm start
```

## Endpoints

- `GET /` - Service info
- `GET /health` - Health check endpoint

## Service Registration

The gateway automatically registers with Eureka Server on startup at:
- **App Name**: `gateway-service`
- **Instance ID**: `gateway-service:3000`
- **Port**: 3000

## Project Structure

```
gateway-service/
├── config/
│   └── eureka.js          # Eureka client configuration
├── middleware/
│   └── authMiddleware.js  # Authentication middleware (TODO)
├── routes/
│   └── proxyRoutes.js     # Proxy routes configuration (TODO)
├── server.js              # Main application entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables (not in git)
└── .env.example           # Environment variables template
```

## Next Steps

1. Implement authentication middleware in `middleware/authMiddleware.js`
2. Configure proxy routes in `routes/proxyRoutes.js`
3. Add rate limiting and request throttling
4. Implement service-specific routing logic
5. Add monitoring and logging
