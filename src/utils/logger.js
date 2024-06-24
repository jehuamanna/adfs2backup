const expressContext = require('@niveus/express-context');
const { config } = require('@niveus/winston-utils');
const winston = require('winston');
const { combine, json, errors, timestamp } = winston.format;
const { google } = config;

const contextLogs = winston.format((info) => {
  const keyNames = ['reqid', 'reqPath']; // Set by the middleware. It is configurable.
  const [requestId, reqPath] = expressContext.getMany(keyNames);

  info = { ...info, ...{ requestId, reqPath } };

  return info;
})();


const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'error', // Setting default level to 'error' if log level is not provided.
  levels: google.levels,
  format: combine(
    errors({ stack: true }),
    timestamp(),
    contextLogs,
    json(),
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.colorize({ all: true }) })],
});

winston.addColors(google.colors);

module.exports = logger;
