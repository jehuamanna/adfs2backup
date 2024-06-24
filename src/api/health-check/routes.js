const healthCheckRouter = require('express').Router();
const { healthCheck } = require('./controller');

healthCheckRouter.get('/', healthCheck);


module.exports = healthCheckRouter;
