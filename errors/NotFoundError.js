const { ERROR_MESSAGES } = require('./constants');

module.exports = class NotFoundError extends Error {
  constructor(message = ERROR_MESSAGES.NOT_FOUND_ERROR) {
    super(message);
    this.statusCode = 404;
  }
};
