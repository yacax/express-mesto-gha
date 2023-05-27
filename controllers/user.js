const User = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const InternalServerError = require('../errors/InternalServerError');
const UserNotFoundError = require('../errors/UserNotFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => next(new InternalServerError()));
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;

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

module.exports.updateProfile = (req, res, next) => {
  const userId = req.user._id;
  const fieldsToUpdate = req.body;

  User.findByIdAndUpdate(userId, fieldsToUpdate, { new: true })
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
  const { userId } = req.user;

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
