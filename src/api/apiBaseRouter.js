const healthCheckRouter = require('./health-check/routes');
const apiBaseRouter = require('express').Router();

// Exposed endpoints
apiBaseRouter.use('/health-check', healthCheckRouter);


module.exports = apiBaseRouter;
