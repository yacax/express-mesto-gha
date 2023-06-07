const router = require('express').Router();
const {

  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,

} = require('../controllers/card');

const {

  validateId,
  validateCardFields,
  validateBearerToken,

} = require('../utils/validators');

router.get('/', validateBearerToken, getCards);
router.post('/', validateCardFields, createCard);
router.delete('/:cardId', validateId, deleteCard);
router.put('/:cardId/likes', validateId, likeCard);
router.delete('/:cardId/likes', validateId, unlikeCard);

module.exports = router;
