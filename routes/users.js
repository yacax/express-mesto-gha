const router = require('express').Router();
const {

  validateId,
  validateUserFields,
  validateBearerToken,

} = require('../utils/validators');

const {

  getUsers,
  getUserById,
  updateAvatar,
  updateProfile,
  getCurrentUser,

} = require('../controllers/user');

router.get('/', validateBearerToken, getUsers);
router.get('/me', validateBearerToken, getCurrentUser);
router.get('/:userId', validateId, getUserById);
router.patch('/me', validateUserFields, updateProfile);
router.patch('/me/avatar', validateUserFields, updateAvatar);

module.exports = router;
