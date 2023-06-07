const mongoose = require('mongoose');
const BadRequestError = require('../errors/BadRequestError');

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
        return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/.test(v);
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
