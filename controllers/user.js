const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { checkIdValidity } = require('../utils/checkIdValidity');
const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const NotFoundError = require('../errors/NotFoundError');
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
    .then((user) => res.status(201).send({
      _id: user._id,
      email: user.email,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      if (err instanceof BadRequestError) {
        next(err);
      } else if (err.code === 11000) {
        next(new UserAlreadyExist());
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthenticationError();
      }

      return bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            throw new AuthenticationError();
          }

          const token = jwt.sign(
            { _id: user._id },
            'some-secret-key',
            { expiresIn: '7d' },
          );

          res.send({ token });
        });
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
        next(new NotFoundError());
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
        next(new NotFoundError());
        return;
      }
      res.send({ data: user });
    })
    .catch(next);
};

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const fieldsToUpdate = req.body;

  User.findByIdAndUpdate(userId, fieldsToUpdate, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError());
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
        next(new NotFoundError());
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
