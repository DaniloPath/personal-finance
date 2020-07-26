const mongoose = require('mongoose');

let schema = mongoose.Schema({
  description: { type: String },
  value: { type: Number },
  category: { type: String },
  year: { type: Number },
  month: { type: Number },
  day: { type: Number },
  yearMonth: { type: String },
  yearMonthDay: { type: String },
  type: { type: String },
});

const TransactionModel = mongoose.model('transaction', schema);

module.exports = TransactionModel;
