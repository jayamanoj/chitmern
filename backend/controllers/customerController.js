const Customer = require('../models/customerModel'); // Assuming this is the customer model path
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// Get all customers with search, filter, and pagination
exports.getCustomers = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Customer.find(), req.query).search().filter().paginate();
    const customers = await apiFeatures.query;
    
    res.status(200).json({
        success: true,
        customers
    });
});

// Create a new customer
exports.newCustomer = catchAsyncError(async (req, res, next) => {
    try {
        const customer = await Customer.create(req.body);
        
        res.status(201).json({
            success: true,
            customer
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// Get a single customer by ID
exports.getSingleCustomer = catchAsyncError(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return next(new ErrorHandler('Customer not found', 404));
    }

    res.status(200).json({
        success: true,
        customer
    });
});

// Update an existing customer by ID
exports.updateCustomer = catchAsyncError(async (req, res, next) => {
    let customer = await Customer.findById(req.params.id);

    if (!customer) {
        return next(new ErrorHandler('Customer not found', 404));
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        customer
    });
});

// Delete a customer by ID
exports.deleteCustomer = catchAsyncError(async (req, res, next) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return next(new ErrorHandler('Customer not found', 404));
    }

    await Customer.findByIdAndDelete(req.params.id);


    res.status(200).json({
        success: true,
        message: 'Customer deleted successfully'
    });
});

// Get active customers only
exports.getActiveCustomers = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Customer.find({ Status: "alive" }), req.query).search().filter().paginate();
    const customers = await apiFeatures.query;
    
    res.status(200).json({
        success: true,
        customers
    });
});
