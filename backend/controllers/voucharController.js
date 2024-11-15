const Vouchar = require('../models/voucherModel'); // Replace with the correct path to your Chit model
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// Add a new chit
exports.addVouchar = catchAsyncError(async (req, res, next) => {
  try {
    const chit = await Vouchar.create(req.body);
    res.status(201).json({
      success: true,
      chit,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get a single chit by ID
exports.getSingleVouchar = catchAsyncError(async (req, res, next) => {
  const chit = await Vouchar.findById(req.params.id);

  if (!chit) {
    return next(new ErrorHandler('Chit not found', 404));
  }

  res.status(200).json({
    success: true,
    chit,
  });
});

// Get all chits with search, filter, and pagination
exports.getAllVouchar = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new APIFeatures(Vouchar.find(),req.query).search().filter().paginate();

  const vouchardata = await apiFeatures.query;

  res.status(200).json({
    success: true,
    Vouchardata: vouchardata,
  });
});

// Update a chit by ID
exports.updateVouchar = catchAsyncError(async (req, res, next) => {
  let chit = await Vouchar.findById(req.params.id);

  if (!chit) {
    return next(new ErrorHandler('Chit not found', 404));
  }

  chit = await Chit.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    chit,
  });
});

// Delete a chit by ID
exports.deleteVouchar = catchAsyncError(async (req, res, next) => {
  const chit = await Vouchar.findById(req.params.id);

  if (!chit) {
    return next(new ErrorHandler('Chit not found', 404));
  }

  await Chit.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Chit deleted successfully',
  });
});
