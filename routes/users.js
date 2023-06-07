const router = require('express').Router();

const { validateUserId, validateUserFields } = require('../utils/validators');

const {
  getUsers,
  getUserById,
  updateAvatar,
  updateProfile,
  getCurrentUser,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUserFields, updateProfile);
router.patch('/me/avatar', validateUserFields, updateAvatar);

module.exports = router;
