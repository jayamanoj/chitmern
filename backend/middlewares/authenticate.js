const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('./catchAsyncError');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Check if user is authenticated
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    // Check if token exists
    if (!token) {
        return next(new ErrorHandler('Please log in first', 401)); // 401 Unauthorized
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by decoded token id
    req.user = await User.findById(decoded.id);

    // Proceed to next middleware
    next();
});

// Check if user is authorized for specific roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        // Check if user role is authorized
        if (!roles.includes(req.user.role)) {
            return next(new ErrorHandler(`Role ${req.user.role} is not authorized`, 403)); // 403 Forbidden
        }
        // Proceed if authorized
        next();
    };
};

