const mongoose = require("mongoose");
const { Schema } = mongoose;

const LoanDetailSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Books", required: true },
  book_title: { type: String, required: true },
});

const LoanSchema = new Schema({
  User: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  Loan_date: { type: Date, default: Date.now },
  Devolution_date: { type: Date, required: true },
  Loan_state: { type: String, required: true },
  Details: [LoanDetailSchema],
});

module.exports = mongoose.model("Loans", LoanSchema);
