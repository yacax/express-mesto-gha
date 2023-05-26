const { ERROR_MESSAGES } = require('./constants');

module.exports = class InternalServerError extends Error {
  constructor(message = ERROR_MESSAGES.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = 500;
  }
};
