
const catchAsyncError =require('../middlewares/catchAsyncError')
const APIFeatures =require('../utils/apiFeatures')
const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const sentToken = require('../utils/jwt');

// Register a new user
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password,role } = req.body;
    const user = await User.create({
        name,
        email,
        password,
        role
    });

    sentToken(user, 201, res);
});


exports.getUser = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeatures(User.find(),req.query).search().filter().paginate()
    const Userlist = await apiFeatures.query;
    res.status(200).json({
        success: true,
        Userlist
    });
});

// Login user
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        return next(new errorHandler("Please enter email and password", 400)); // 400 Bad Request
    }

    // Find user by email and explicitly select password
    const user = await User.findOne({ email }).select('+password');

    // Check if user exists
    if (!user) {
        return next(new errorHandler("Invalid email or password", 401)); // 401 Unauthorized
    }

    // Check if password matches
    if (!await user.isValidPassword(password)) {
        return next(new errorHandler("Invalid email or password", 401)); // 401 Unauthorized
    }

    // Send token if login successful
    sentToken(user, 200, res); // 200 OK
});


exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};
