const mongoose = require('mongoose');

const chitDetailSchema = new mongoose.Schema({
  chit_name: {
    type: String,
    required: [true, 'Chit name is required'],
  },
  Tolal_amount: {
    type: Number,
    required: [true, 'Total amount is required'],
  },
  Due_amount: {
    type: Number,
    required: [true, 'Due amount is required'],
  },
  time_preiod: {
    type: String,
    required: [true, 'Time period is required'],
  },
});

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Member name is required'],
  },
  member_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

const chitSchema = new mongoose.Schema({
  chit_det: {
    type: chitDetailSchema,
    required: true,
  },
  member_list: [memberSchema],
});

module.exports = mongoose.model('Chit', chitSchema);
