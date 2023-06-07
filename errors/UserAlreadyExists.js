const { ERROR_MESSAGES } = require('./constants');

module.exports = class UserAlreadyExist extends Error {
  constructor(message = ERROR_MESSAGES.USER_ALREADY_EXISTS) {
    super(message);
    this.statusCode = 409;
  }
};
