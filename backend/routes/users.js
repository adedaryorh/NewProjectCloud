const express = require('express');
const router = express.Router();

const UserController = require('../controllers/UserController');
const Auth = require('../middleware/Auth');
const { 
    validate, 
    registerValidation, 
    loginValidation,
    activationValidation,
    resendCodeValidation,
    resetValidation
} = require('../helpers/validators');

// @route  api/signup
// @method POST
// @access Public
// @desc register user
router.post('/signup', registerValidation(), validate, UserController.registerUser);

// @route  api/login
// @method POST
// @access Public
// @desc login user
router.post('/login', loginValidation(), validate, UserController.loginUser);

// @route  api/auth
// @method GET
// @access Private
router.get('/auth', Auth, UserController.getLoggedInUser);

// @route  api/activate
// @method POST
// @access Public
// @desc Activate
router.post('/activate', activationValidation(), validate, UserController.verifyUser);

// @route  api/resend-token
// @method PATCH
// @access Public
// @desc resend token
router.patch('/resend-token', resendCodeValidation(), validate, UserController.resendCode);

// @route  api/reset-password
// @method PATCH
// @access Public
// @desc reset password
router.patch('/reset-password', resetValidation(), validate, UserController.forgotPassword);

module.exports = router;