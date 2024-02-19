const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { createProxyMiddleware } = require('http-proxy-middleware');

// Middlewares
const app = express();
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.disable("x-powered-by"); // hides express server.

// Define routes and corresponding microservices
const services = [
  { route: '/auth', target: 'https://domain-service-1.com/auth/v1' },
  { route: '/users', target: 'https://domain-service-2.com/users/v1' },
  { route: '/posts', target: 'https://domain-service-3.com/posts/v1' },
  // Add more services as needed
];

// Set up proxy middleware for each microservice
services.forEach(({ route, target }) => {
  app.use(route, createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: {
      [`^${route}`]: ''
    }
  }));
});

const PORT = process.env.PORT || 9834; 
app.listen(PORT, () => {
  console.log(`Gateway is running on port ${PORT}`);
});
