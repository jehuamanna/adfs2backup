const _ = require('lodash');
const logger = require('utils/logger');
const errorCodes = require('constants/errorCodes');

class ExpressError extends Error {
  // Private variable to store the error object.
  #errorObj = null;

  constructor(error, { logError = true } = {}) {
    super(''); // Create error object with empty error.

    if (error && typeof (error) === 'string') {
      this.#errorObj = _.has(errorCodes, error) ? errorCodes[error] : errorCodes['DEFAULT_ERROR'];
    } else if (error && Object.getPrototypeOf(error).constructor?.name === this.constructor.name) {
      this.#errorObj = errorCodes[error.errorCode];
    } else {
      this.#errorObj = errorCodes['DEFAULT_ERROR'];
    }

    this.#InitiateErrorObject();

    this.#errorLog(logError);
  }

  #InitiateErrorObject() {
    this.message = this.#errorObj.externalMessage;
    this.statusCode = this.#errorObj.statusCode;
    this.errorCode = this.#errorObj.errorCode;
    this.internalMessage = this.#errorObj.internalMessage;
  }

  #errorLog(logError) {
    if (logError) {
      logger.error({ message: this.message, statusCode: this.statusCode });
    }
  }

}

module.exports = ExpressError;
