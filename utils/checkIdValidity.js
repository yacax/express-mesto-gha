const mongoose = require('mongoose');
const BadRequestError = require('../errors/BadRequestError');

module.exports.checkIdValidity = (id, next) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    next(new BadRequestError());
    return false;
  }
  return true;
};
