const logger = require('utils/logger');
const ExpressError = require('utils/expressError');

const healthCheck = (req, res, next) => {
  try {

    logger.info('Called health-check endpoint');

    return res.sendStatus(200);
  } catch (error) {

    next(new ExpressError());
  }
};

module.exports = {
  healthCheck,
};
