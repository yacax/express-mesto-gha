const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const { regexPatterns } = require('./regexPatterns');

module.exports.validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexPatterns.link),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateAuthentication = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

module.exports.validateUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('Invalid user id');
      }
      return value;
    }, 'custom validation'),
  }),
});

module.exports.validateUserFields = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(regexPatterns.link),
  }).or('name', 'about', 'avatar'),
});

module.exports.validateCardFields = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(regexPatterns.link),
  }),
});

module.exports.validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error('Invalid card id');
      }
      return value;
    }, 'custom validation'),
  }),
});

module.exports.validateBearerToken = celebrate({
  headers: Joi.object({
    authorization: Joi.string().pattern(regexPatterns.token),
  }).unknown(),
});
