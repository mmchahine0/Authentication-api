const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.post('/create', auth, userController.createUser);
router.get('/', auth, userController.getUsers);

module.exports = router;