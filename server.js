const app = require('./src/app');
const logger = require('utils/logger');
const serverPort = process.env.SERVICE_PORT;
const baseURL = process.env.SERVICE_BASE_URL || '/api-service';


// Start the server.
const server = app.listen(serverPort, () => {
  logger.info(`Service started on port ${serverPort}.`);

  logger.info(`Swagger-UI is available on http://localhost:${serverPort}${baseURL}/api-docs`);
});


// Handle SIGTERM signal.
process.on('SIGTERM', () => {
  logger.warn('SIGTERM signal received: closing server');
  server.close(() => {
    logger.info('Server is closed');
  });
});
