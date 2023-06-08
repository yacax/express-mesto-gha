const mongoose = require('mongoose');
const BadRequestError = require('../errors/BadRequestError');
const { regexPatterns } = require('../utils/regexPatterns');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v) {
        return regexPatterns.link.test(v);
      },
      message: 'URL is not valid!',
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

cardSchema.methods.validateSync = function validateSync(...args) {
  const validationResult = mongoose.Schema.prototype.validateSync.apply(this, args);
  if (validationResult && validationResult.errors) {
    throw new BadRequestError();
  }
};

module.exports = mongoose.model('card', cardSchema);
