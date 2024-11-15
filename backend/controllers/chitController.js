const Chit = require('../models/chitModel'); // Replace with the correct path to your Chit model
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');

// Add a new chit
exports.addChit = catchAsyncError(async (req, res, next) => {
  try {
    const chit = await Chit.create(req.body);
    res.status(201).json({
      success: true,
      chit,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get a single chit by ID
exports.getSingleChit = catchAsyncError(async (req, res, next) => {
  const chit = await Chit.findById(req.params.id);

  if (!chit) {
    return next(new ErrorHandler('Chit not found', 404));
  }

  res.status(200).json({
    success: true,
    chit,
  });
});

// Get all chits with search, filter, and pagination
exports.getAllChits = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new APIFeatures(
    Chit.find().populate('member_list.member_id', 'name phone'), // Populating member details
    req.query
  ).search().filter().paginate();

  const chits = await apiFeatures.query;

  // Format response to include member details
  const chitsWithDetails = chits.map(chit => ({
    ...chit._doc,
    members: chit.member_list.map(member => ({
      name: member.member_id ? member.member_id.name : 'Unknown',
      phone: member.member_id ? member.member_id.phone : 'N/A',
    })),
  }));

  res.status(200).json({
    success: true,
    chits: chitsWithDetails,
  });
});

// Update a chit by ID
exports.updateChit = catchAsyncError(async (req, res, next) => {
  let chit = await Chit.findById(req.params.id);

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
exports.deleteChit = catchAsyncError(async (req, res, next) => {
  const chit = await Chit.findById(req.params.id);

  if (!chit) {
    return next(new ErrorHandler('Chit not found', 404));
  }

  await Chit.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Chit deleted successfully',
  });
});
