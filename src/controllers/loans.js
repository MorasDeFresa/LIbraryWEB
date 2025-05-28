const LoanDB = require("../models/Loans");
const UserDB = require("../models/User");
const BookDB = require("../models/Book");
const User = require("../models/User");

const ListDependenciesLoans = async (res) => {
  const Users = await UserDB.find()
    .lean()
    .sort({ nombre_usuario: "ascending" });
  const Books = await BookDB.find().lean().sort({ Name: "ascending" });
  res.render("loans/create_loans", { Users, Books });
};

const CreateLoan = async (req, res) => {
  try {
    const errors = [];
    const { User, Devolution_date, Loan_state } = req.body;
    const details = JSON.parse(req.body.Details || "[]");
    console.log("Detalles recibidos:", details);
    const savedValues = { User, Devolution_date, Loan_state, details };

    const requiredFields = ["User", "Devolution_date"];

    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].length === 0) {
        errors.push({
          text: "Datos incompletos para la creación del préstamo",
        });
        break;
      }
    }

    if (errors.length > 0) {
      const [Users, Books] = await Promise.all([
        UserDB.find().lean().sort({ Username: "ascending" }),
        BookDB.find().lean().sort({ Name: "ascending" }),
      ]);

      res.render("loans/create_loans", {
        errors,
        Users,
        Books,
        ...savedValues,
      });
    } else {
      const newLoan = new LoanDB({ ...savedValues });
      await newLoan.save();
      req.flash("success_msg", "El nuevo préstamo se registró exitosamente");
      res.redirect("/loans/add");
    }
  } catch (error) {
    console.log(error);
  }
};

const SearchLoans = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm?.toString().trim();

    if (!searchTerm || searchTerm.length < 2) {
      return res.render("loans/search_loans", {
        searchTerm: "",
        loans: [],
        message: "Por favor, ingresa al menos 2 caracteres para buscar.",
      });
    }

    // Buscar libros que coincidan con el nombre
    const books = await BookDB.find({
      Name: { $regex: searchTerm, $options: "i" },
    }).lean();

    if (!books.length) {
      return res.render("loans/search_loans", {
        searchTerm,
        loans: [],
        message: "No se encontraron libros con ese nombre.",
      });
    }

    const bookIds = books.map((book) => book._id);

    // Buscar préstamos que contienen esos libros
    const loans = await LoanDB.find({
      "details.book": { $in: bookIds },
    })
      .populate("User")
      .populate("details.book") // <- muy importante para mostrar el nombre
      .lean();

    // Agregar formato de fecha y extraer títulos de los libros
    const formatDate = (date) => {
      const d = new Date(date);
      return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${d.getFullYear()}`;
    };

    loans.forEach((loan) => {
      loan.Loan_date_formatted = formatDate(loan.loan_date);
      loan.Devolution_date_formatted = formatDate(loan.Devolution_date);
      loan.details.forEach((detail) => {
        detail.book_title = detail.book?.Name || "Libro no encontrado";
      });
    });

    res.render("loans/search_loans", {
      searchTerm,
      loans,
      message: loans.length ? null : "No hay préstamos para ese libro.",
    });
  } catch (error) {
    console.error("Error en SearchLoans:", error);
    res.status(500).send("Error interno al buscar préstamos.");
  }
};

//prueba

const ListLoanById = async (req, res) => {
  const loan = await LoanDB.findById(req.params.id).lean();

  const selectedUserId = loan.User?.toString();
  const selectedState = loan.loan_state;
  const selectedBooks = loan.details?.map((d) => d.book.toString()) || [];

  // Formatear fecha a input[type="date"]
  const formatDateForInput = (date) => {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  const loanStates = ["activo", "finalizado", "vencido"].map((state) => ({
    name: state,
    selected: state === loan.loan_state,
  }));

  const Users = await UserDB.find().lean().sort({ Username: "ascending" });
  const Books = await BookDB.find().lean().sort({ Name: "ascending" });

  res.render("loans/edit_loan", {
    loan,
    Users,
    Books,
    selectedUserId,
    selectedState,
    loanStates,
    selectedBooks,
    devolution_date_formatted: formatDateForInput(loan.Devolution_date),
  });
};

const EditLoan = async (req, res) => {
  const { user, devolution_date, loan_state, details } = req.body;

  const parsedDetails = Array.isArray(details)
    ? details.map((d) => JSON.parse(d))
    : details
    ? [JSON.parse(details)]
    : [];

  await LoanDB.findByIdAndUpdate(req.params.id, {
    User: user,
    Devolution_date: devolution_date,
    loan_state: loan_state,
    Details: parsedDetails,
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
  const loans = await LoanDB.find().populate("User").lean();
  const user = res.locals.isAuthenticated;
  res.render("loans/view_loans", { loans, user });
};

const GetSingleLoan = async (req, res) => {
  const loan = await LoanDB.findById(req.params.id).lean().populate("User");
  const user = res.locals.isAuthenticated;
  // Formatear fechas directamente desde el controlador
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Añadir fechas formateadas al objeto
  loan.Loan_date_formatted = formatDate(loan.loan_date);
  loan.Devolution_date_formatted = formatDate(loan.Devolution_date);

  res.render("loans/view_single_loans", { loan, user });
};

module.exports = {
  ListDependenciesLoans,
  CreateLoan,
  ListLoanById,
  EditLoan,
  DeleteLoan,
  GetAllLoans,
  GetSingleLoan,
  SearchLoans,
};
