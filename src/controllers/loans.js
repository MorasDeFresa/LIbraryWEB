const LoanDB = require("../models/Loans");
const UserDB = require("../models/User");
const BookDB = require("../models/Book");

const ListDependenciesLoans = async (res) => {
  const Users = await UserDB.find()
    .lean()
    .sort({ nombre_usuario: "ascending" });
  const Books = await BookDB.find().lean().sort({ Name: "ascending" });
  res.render("loans/create_loan", { Users, Books });
};

const CreateLoan = async (req, res) => {
  const errors = [];
  const savedValues = ({ User, Devolution_date, Loan_state, Details } =
    req.body);

  const requiredFields = ["User", "Devolution_date", "Loan_state", "Details"];

  for (const field of requiredFields) {
    if (!req.body[field] || req.body[field].length === 0) {
      errors.push({ text: "Datos incompletos para la creación del préstamo" });
      break;
    }
  }

  if (errors.length > 0) {
    const [Users, Books] = await Promise.all([
      UserDB.find().lean().sort({ Username: "ascending" }),
      BookDB.find().lean().sort({ Name: "ascending" }),
    ]);

    res.render("loans/create_loan", {
      errors,
      Users,
      Books,
      ...savedValues,
    });
  } else {
    const newLoan = new LoanDB({savedValues});
    await newLoan.save();
    req.flash("success_msg", "El nuevo préstamo se registró exitosamente");
    res.redirect("/loans/add");
  }
};

const ListLoanById = async (req, res) => {
  const loan = await LoanDB.findById(req.params.id).lean();
  const User = await UserDB.findById(loan.user).lean();

  const BookDetails = [];
  for (const detail of loan.details) {
    const book = await BookDB.findById(detail.book).lean();
    if (book) {
      BookDetails.push(book);
    }
  }

  const Users = await UserDB.find().lean().sort({ Username: "ascending" });
  const Books = await BookDB.find().lean().sort({ Name: "ascending" });

  res.render("loans/edit_loan", {
    loan,
    Users,
    Books,
    User,
    BookDetails,
  });
};

const EditLoan = async (req, res) => {
  const { User, Devolution_date, Loan_state, Details } = req.body;

  await LoanDB.findByIdAndUpdate(req.params.id, {
    User,
    Devolution_date,
    Loan_state,
    Details,
  }).lean();

  req.flash("success_msg", "Préstamo actualizado satisfactoriamente");
  res.redirect("/loans");
};

const DeleteLoan = async (req, res) => {
  await LoanDB.findByIdAndDelete(req.params.id).lean();
  req.flash("success_msg", "Préstamo eliminado satisfactoriamente");
  res.redirect("/loans");
};

const GetAllLoans = async (req, res) => {
    const loan = await Loans.findById(req.params.id).lean();
    const user = res.locals.isAuthenticated;
    res.render("loans/view_loans",{loan,user});
}

const GetSingleLoan = async (req, res) => {
    const loan = await Loans.findById(req.params.id).lean();
    const user = res.locals.isAuthenticated;
    res.render("loans/view_single_loan",{loan,user});
}

module.exports = {
  ListDependenciesLoans,
  CreateLoan,
  ListLoanById,
  EditLoan,
  DeleteLoan,
  GetAllLoans,
  GetSingleLoan,
};
