const express = require('express');
const { registerUser, loginUser, logoutUser, getUser } = require('../controllers/authController');

const router = express.Router();

router.route('/register').post(registerUser); // Ensure getProduct is correctly defined

router.route('/login').post(loginUser); // Ensure getProduct is correctly defined

router.route('/logout').get(logoutUser); // Ensure getProduct is correctly defined

router.route('/getuser').get(getUser)


module.exports = router;
