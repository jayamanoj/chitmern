const Product = require('../models/productModel'); // Example model

const ErrorHandler =require('../utils/errorHandler')
const catchAsyncError =require('../middlewares/catchAsyncError')
const APIFeatures =require('../utils/apiFeatures');
const Bill = require('../models/billModel');

exports.getBill = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeatures(Bill.find(),req.query).search().filter().paginate()
    const bills = await apiFeatures.query;
    res.status(200).json({
        success: true,
        bills
    });
});

exports.newBill = catchAsyncError(async (req, res, next) => {
    try {
      const bill = await Bill.create(req.body);
      res.status(201).json({
        success: true,
        bill,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400)); // Send error response
    }
  });
  

exports.getsingleBill = async (req, res, next) => {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        bill
    });
};

exports.updateBill = async (req, res, next) => {
    let bill = await Bill.findById(req.params.id);

    if (!bill) {
        return next(new ErrorHandler('Product not found', 404));
    }

    bill = await Bill.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        bills
    });
};

exports.deleteBill = async (req, res, next) => {
    const bills = await Bill.findById(req.params.id);

    if (!bills) {
        return next(new ErrorHandler('Product not found', 404));
    }

    await Bill.findByIdAndDelete(req.params.id); // Use findByIdAndDelete

    res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
    });
};

// Fetch all bills for a user
exports.getUserBills = async (req, res, next) => {
  try {
    const bills = await Bill.find({ userId: req.params.userId }); // Fetch bills by userId

    if (!bills || bills.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bills found for this user",
      });
    }

    res.status(200).json({
      success: true,
      bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// exports.getallBill = catchAsyncError(async (req, res, next) => {
//   // Using APIFeatures to apply search, filter, and pagination logic
//   const apiFeatures = new APIFeatures(
//     Bill.find().populate('userId', 'username'), // Populate username from the User model
//     req.query
//   ).search().filter().paginate();
  
//   // Execute the query to get the bills
//   const bills = await apiFeatures.query;
  
//   // Send the response with the bills and their associated usernames
//   res.status(200).json({
//     success: true,
//     bills
//   });
// });


exports.getallBill = catchAsyncError(async (req, res, next) => {
  const apiFeatures = new APIFeatures(
    Bill.find().populate('userId', 'username'), // Ensure you are populating the correct field
    req.query
  ).search().filter().paginate();

  const bills = await apiFeatures.query;

  // Modify the response to include username
  const billsWithUsernames = bills.map(bill => ({
    ...bill._doc,
    username: bill.userId ? bill.userId.username : 'Unknown User' // Check for userId before accessing username
  }));

  res.status(200).json({
    success: true,
    bills: billsWithUsernames,
  });
});
