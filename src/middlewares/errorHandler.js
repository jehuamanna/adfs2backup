const logger = require('utils/logger');
const ExpressError = require('utils/expressError');

const errorHandler = (err, req, res, next) => {
  // If the error object is an instance of ExpressError, use it's properties in the response.
  if (err && err instanceof ExpressError) {
    logger.error(err);

    return res.status(err.statusCode).json({
      message: err.message,
    });
  } else if (err) {
    // Failsafe error handling to prevent internal logs getting exposed to the frontend.
    // Error level is set to `critical` because it is unhandled error.

    logger.crit(err);

    return res.status(500).json({
      message: 'Internal Server Error',
    });
  }

  next();
};

module.exports = errorHandler;
