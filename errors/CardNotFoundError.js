const { ERROR_MESSAGES } = require('./constants');

module.exports = class CardNotFoundError extends Error {
  constructor(message = ERROR_MESSAGES.CARD_NOT_FOUND) {
    super(message);
    this.statusCode = 404;
  }
};
