const { ERROR_MESSAGES } = require('./constants');

module.exports = class AuthenticationError extends Error {
  constructor(message = ERROR_MESSAGES.AUTHENTICATION_ERROR) {
    super(message);
    this.statusCode = 401;
  }
};
