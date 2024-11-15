const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: /^\d{10}$/, // Validates a 10-digit phone number
  },
  pending_flag: {
    type: Boolean,
    default: false
  },
  OldBlance: {
    type: Number,
    default: 0
  },
  Status: {
    type: String,
    enum: ["alive", "Waiting", "OFF"],
    default: ""
  }
}, { timestamps: true });

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
