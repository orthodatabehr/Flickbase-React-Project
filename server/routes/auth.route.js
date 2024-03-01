const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// MIDDLEWARE
// this middleware will check to see if the signed in user's token is valid 
const auth = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/signin',authController.signin);
router.get('/isauth',auth(),authController.isauth);

module.exports = router;