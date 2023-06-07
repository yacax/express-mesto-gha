const Card = require('../models/card');
const { checkIdValidity } = require('../utils/checkIdValidity');
const BadRequestError = require('../errors/BadRequestError');
const CardNotFoundError = require('../errors/CardNotFoundError');
const InternalServerError = require('../errors/InternalServerError');
const AuthenticationError = require('../errors/AuthenticationError');
const NoRightsToTheOperation = require('../errors/NoRightsToTheOperation');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => next(new InternalServerError()));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  if (!checkIdValidity(cardId, next)) {
    return;
  }

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new CardNotFoundError();
      }
      if (card.owner.toString() !== userId) {
        throw new NoRightsToTheOperation();
      }
      return Card.findByIdAndRemove(cardId);
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CardNotFoundError) {
        next(err);
      } else if (err instanceof AuthenticationError) {
        next(err);
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  if (!checkIdValidity(userId, next) || !checkIdValidity(cardId, next)) {
    return;
  }

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new CardNotFoundError();
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CardNotFoundError) {
        next(err);
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.unlikeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  if (!checkIdValidity(userId, next) || !checkIdValidity(cardId, next)) {
    return;
  }

  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new CardNotFoundError();
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CardNotFoundError) {
        next(err);
      } else {
        next(new InternalServerError());
      }
    });
};
