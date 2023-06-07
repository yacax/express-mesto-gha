const router = require('express').Router();
const {

  getCards,
  createCard,
  deleteCard,
  likeCard,
  unlikeCard,

} = require('../controllers/card');

const { validateCardId, validateCardFields, validateBearerToken } = require('../utils/validators');

router.get('/', validateBearerToken, getCards);
router.post('/', validateCardFields, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, likeCard);
router.delete('/:cardId/likes', validateCardId, unlikeCard);

module.exports = router;
