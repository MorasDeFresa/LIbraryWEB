const LoanDB = require("../models/Loans");
const UserDB = require("../models/User");
const BookDB = require("../models/Book");

// Listar usuarios y libros para crear préstamos
const ListDependenciesLoans = async (req, res) => {
  const Users = await UserDB.find()
    .lean()
    .sort({ nombre_usuario: "ascending" });
  const Books = await BookDB.find().lean().sort({ Name: "ascending" });
  res.render("loans/create_loans", { Users, Books });
};

// Crear préstamo
const CreateLoan = async (req, res) => {
  try {
    const { User, Devolution_date } = req.body;
    const Loan_state = "activo";

    // Validar campos requeridos
    if (!User || !Devolution_date) {
      req.flash("error_msg", "Todos los campos son requeridos");
      return res.redirect("/loans/add");
    }

    let parsedDetails;
    try {
      parsedDetails =
        typeof Details === "string" ? JSON.parse(Details) : Details;

      // Asegurarse que los detalles sean un array
      if (!Array.isArray(parsedDetails)) {
        parsedDetails = [parsedDetails];
      }

      // Validar estructura de cada libro
      parsedDetails = parsedDetails.map((detail) => {
        if (typeof detail === "string") {
          return {
            book: detail,
            book_title: "Título no disponible",
          };
        }
        return {
          book: detail.book || detail._id || detail,
          book_title: detail.book_title || "Título no disponible",
        };
      });
    } catch (error) {
      console.error("Error parsing loan details:", error);
      req.flash("error_msg", "Formato inválido para los libros seleccionados");
      return res.redirect("/loans/add");
    }

    // Validar que haya al menos un libro
    if (parsedDetails.length === 0) {
      req.flash("error_msg", "Debes seleccionar al menos un libro");
      return res.redirect("/loans/add");
    }

    // Crear el nuevo préstamo (usando los nombres del modelo)
    const newLoan = new LoanDB({
      user: User, // Ahora coincide con el modelo
      devolution_date: new Date(Devolution_date), // Ahora coincide
      loan_state: Loan_state, // Ahora coincide
      // details: parsedDetails, // Ahora coincide
    });

    await newLoan.save();
    req.flash("success_msg", "Préstamo creado exitosamente");
    res.redirect("/loans");
  } catch (error) {
    console.error("Error creating loan:", error);
    req.flash("error_msg", "Error al crear el préstamo: " + error.message);
    res.redirect("/loans/add");
  }
};

// Resto de funciones sin cambios
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
  const loan = await LoanDB.findById(req.params.id).lean();
  const user = res.locals.isAuthenticated;
  res.render("loans/view_loans", { loan, user });
};

const GetSingleLoan = async (req, res) => {
  const loan = await LoanDB.findById(req.params.id).lean();
  const user = res.locals.isAuthenticated;
  res.render("loans/view_single_loan", { loan, user });
};

module.exports = {
  ListDependenciesLoans,
  CreateLoan,
  ListLoanById,
  EditLoan,
  DeleteLoan,
  GetAllLoans,
  GetSingleLoan,
};
