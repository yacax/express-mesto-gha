const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const BadRequestError = require('../errors/BadRequestError');
const AuthenticationError = require('../errors/AuthenticationError');
const { regexPatterns } = require('../utils/regexPatterns');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return regexPatterns.link.test(v);
      },
      message: 'URL is not valid!',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        throw new AuthenticationError();
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthenticationError();
          }
          return user;
        });
    });
};

userSchema.methods.validateSync = function validateSync(...args) {
  const validationResult = mongoose.Schema.prototype.validateSync.apply(this, args);
  if (validationResult && validationResult.errors) {
    throw new BadRequestError();
  }
};

module.exports = mongoose.model('user', userSchema);
