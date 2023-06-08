const Card = require('../models/card');
const { checkIdValidity } = require('../utils/checkIdValidity');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const AuthenticationError = require('../errors/AuthenticationError');
const NoRightsToTheOperation = require('../errors/NoRightsToTheOperation');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const { _id: owner } = req.user;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError());
      } else {
        next(err);
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
        throw new NotFoundError();
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
      if (err instanceof NotFoundError) {
        next(err);
      } else if (err instanceof NoRightsToTheOperation) {
        next(err);
      } else if (err instanceof AuthenticationError) {
        next(err);
      } else {
        next(err);
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
        throw new NotFoundError();
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(err);
      } else {
        next(err);
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
        throw new NotFoundError();
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof NotFoundError) {
        next(err);
      } else {
        next(err);
      }
    });
};
