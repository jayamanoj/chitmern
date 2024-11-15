const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  member_id: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  paid_amount: {
    type: Number,
    default: 0,
  },
  pending_amount: {
    type: Number,
    required: true,
  },
  paidStatus: {
    type: String,
    enum: ['not paid', 'partial', 'paid'],
    default: 'not paid',
  },
});

const ChitMasterSchema = new mongoose.Schema({
  chit_name: {
    type: String,
    required: true,
  },
  chit_list: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  member: [MemberSchema],
});

module.exports = mongoose.model('ChitMaster', ChitMasterSchema);
