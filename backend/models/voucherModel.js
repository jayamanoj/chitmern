const mongoose = require('mongoose');

const voucherSchema = new mongoose.Schema({
  voucherType: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  credit: {
    type: Number,
    min: 0,
  },
  debit: {
    type: Number,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
//   accountFrom: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Account',
//     required: true,
//   },
//   accountTo: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Account',
//     required: true,
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true,
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Approved', 'Rejected'],
//     default: 'Pending',
//   },
}, {
  timestamps: true,
});

const Voucher = mongoose.model('Voucher', voucherSchema);

module.exports = Voucher;
