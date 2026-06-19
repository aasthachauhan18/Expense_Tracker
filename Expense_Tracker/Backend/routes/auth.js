const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const auth = require('../middleware/auth')

router.post('/register', register);
router.post('/login',auth, login);

module.exports = router;
