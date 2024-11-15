const Chit = require('../models/chitModel'); // Replace with the correct path to your Chit model
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeatures = require('../utils/apiFeatures');
const ChitMaster =require('../models/chitmasterModel');
const Voucher =require('../models/voucherModel');
const Customer=require('../models/customerModel')

exports.addChit = catchAsyncError(async (req, res, next) => {
  try {
    // Create the chit
    const chit = await ChitMaster.create(req.body);

    // Loop through each member in the chit and update their balance
    const { member } = req.body;

    for (const { member_id, amount } of member) {
      const customer = await Customer.findById(member_id);
      
      if (customer) {
        // Ensure amount is treated as a number
        const amountToAdd = Number(amount);

        // Update the customer's balance with the chit amount for each member
        customer.OldBlance += amountToAdd;
        await customer.save();
      }
    }

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
  const chit = await Chit.findById(req.params.id).populate('member_list.member_id','name phone');

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
  const apiFeatures = new APIFeatures(ChitMaster.find(), req.query).search().filter().paginate();
  const chits = await apiFeatures.query;

  res.status(200).json({
    success: true,
    chits,
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



exports.getAllChitsunwind = catchAsyncError(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // Construct the pipeline for the aggregation
  const pipeline = [
    {
      $unwind: '$member', // Unwinds the member array into separate documents
    },
    {
      $match: {
        // Optional: Add search and filter conditions here if needed
        ...(req.query.keyword && {
          chit_name: { $regex: req.query.keyword, $options: 'i' },
        }),
        ...(req.query.memberName && {
          'member.name': { $regex: req.query.memberName, $options: 'i' },
        }),
      },
    },
    {
      $facet: {
        totalData: [
          { $skip: skip },
          { $limit: limit },
        ],
        totalCount: [
          { $count: 'count' },
        ],
      },
    },
  ];

  const result = await ChitMaster.aggregate(pipeline);
  const totalCount = result[0]?.totalCount[0]?.count || 0;
  const chits = result[0]?.totalData || [];

  res.status(200).json({
    success: true,
    totalCount,
    chits,
  });
});


// Update a specific member within a chit by chit ID and member ID
// exports.updateChitMemberDue = catchAsyncError(async (req, res, next) => {
//   const { memberId, paidamount, pendingAmount, paidStatus, date, currentPaidAmount } = req.body;

//   // Find chit document by ID and update the specific member using dot notation
//   let chit = await ChitMaster.findOneAndUpdate(
//     { _id: req.params.id, "member._id": memberId }, // Filter by chit ID and nested member ID
//     {
//       $set: {
//         "member.$.paid_amount": paidamount,
//         "member.$.pending_amount": pendingAmount,
//         "member.$.paidStatus": paidStatus,
//         "member.$.date": date,
//         "member.$.current_paid_amount": currentPaidAmount,
//       }
//     },
//     {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     }
//   );

//   if (!chit) {
//     return next(new ErrorHandler("Chit or member not found", 404));
//   }

//   res.status(200).json({
//     success: true,
//     chit,
//   });
// });




exports.updateChitMemberDue = catchAsyncError(async (req, res, next) => {
  const {member_Id, memberId, paidamount, amount, paidStatus, date, currentPaidAmount } = req.body;
  console.log(member_Id)
  // Find chit document by ID and update the specific member using dot notation
  let chit = await ChitMaster.findOneAndUpdate(
    { _id: req.body.id, "member._id": memberId }, // Filter by chit ID and nested member ID
    {
      $set: {
        "member.$.paid_amount": paidamount,
        "member.$.pending_amount": amount,
        "member.$.paidStatus": paidStatus,
        "member.$.date": date,
      }
    },
    {
      new: true,
    }
  );

  if (!chit) {
    return next(new ErrorHandler("Chit or member not found", 404));
  }

  // Create a new voucher entry
  const voucher = new Voucher({
    voucherType: 'Receipt', // assuming the voucher type is 'Receipt'
    date: date || Date.now(),
    credit: paidamount,
    description: `Payment for member ${memberId} in chit ${chit._id}`,
  });

  await voucher.save();

  // Decrease balance for the specific customer
  const customer = await Customer.findById(member_Id);

  if (customer) {
    // Convert paidamount to a number to ensure correct arithmetic
    const paidAmountAsNumber = Number(paidamount);

    // Deduct the paid amount from the customer's OldBlance
    customer.OldBlance -= paidAmountAsNumber;
    await customer.save();
  } else {
    return next(new ErrorHandler("Customer not found", 404));
  }

  res.status(200).json({
    success: true,
    chit,
  });
});

