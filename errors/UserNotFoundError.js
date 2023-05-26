const { ERROR_MESSAGES } = require('./constants');

module.exports = class UserNotFoundError extends Error {
  constructor(message = ERROR_MESSAGES.USER_NOT_FOUND) {
    super(message);
    this.statusCode = 404;
  }
};
