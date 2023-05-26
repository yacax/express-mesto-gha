const router = require('express').Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
} = require('../controllers/user');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
