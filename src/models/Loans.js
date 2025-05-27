const mongoose = require("mongoose");
const { Schema } = mongoose;

const LoanDetailSchema = new Schema({
  book: { type: Schema.Types.ObjectId, ref: "Books", required: true },
  book_title: { type: String, required: true },
});

const LoanSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  loan_date: { type: Date, default: Date.now },
  devolution_date: { type: Date, required: true },
  loan_state: { type: String, required: true, default: "activo" },
  details: { type: [LoanDetailSchema], required: false },
});

module.exports = mongoose.model("Loans", LoanSchema);
