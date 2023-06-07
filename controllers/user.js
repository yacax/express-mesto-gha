const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { checkIdValidity } = require('../utils/checkIdValidity');
const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const UserNotFoundError = require('../errors/UserNotFoundError');
const AuthenticationError = require('../errors/AuthenticationError');
const UserAlreadyExist = require('../errors/UserAlreadyExists');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(new InternalServerError()));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserAlreadyExist());
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch(() => {
      next(new AuthenticationError());
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  if (!checkIdValidity(userId, next)) {
    return;
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new UserNotFoundError());
        return;
      }
      res.send({ data: user });
    })
    .catch(() => next(new InternalServerError()));
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id: userId } = req.user;
  if (!checkIdValidity(userId, next)) {
    return;
  }
  User.findById(userId)
    .then((user) => {
      if (!user) {
        next(new UserNotFoundError());
        return;
      }
      res.send({
        _id: user._id,
        email: user.email,
        name: user.name,
        about: user.about,
      });
    })
    .catch(() => next(new InternalServerError()));
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const fieldsToUpdate = req.body;

  User.findByIdAndUpdate(userId, fieldsToUpdate, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new UserNotFoundError());
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        next(new UserNotFoundError());
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(new InternalServerError());
      }
    });
};
