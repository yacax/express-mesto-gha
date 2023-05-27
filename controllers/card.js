const Card = require('../models/card');
const { checkIdValidity } = require('../utils/checkIdValidity');
const BadRequestError = require('../errors/BadRequestError');
const CardNotFoundError = require('../errors/CardNotFoundError');
const InternalServerError = require('../errors/InternalServerError');

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
  const { _id: cardId } = req.params;

  Card.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new CardNotFoundError();
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err instanceof CardNotFoundError) {
        next(err);
      } else {
        next(new InternalServerError());
      }
    });
};

module.exports.likeCard = (req, res, next) => {
  const { cardId } = req.params;
  const { _id: userId } = req.user;

  console.log(cardId);

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
