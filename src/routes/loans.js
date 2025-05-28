const router = require("express").Router();
const {
  isAuthenticated,
  isAuthenticatedWithLessOptions,
} = require("../helpers/auth");
const {
  ListDependenciesLoans,
  CreateLoan,
  ListLoanById,
  EditLoan,
  DeleteLoan,
  GetAllLoans,
  GetSingleLoan,
} = require("../controllers/loans");

router.get("/loans/add", isAuthenticated, async (req, res) => {
  try {
    await ListDependenciesLoans(res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/loans/add", isAuthenticated, async (req, res) => {
  try {
    await CreateLoan(req, res);
  } catch (error) {
    console.error('El error xd:',error);
  }
});

router.get("/loans/edit/:id", isAuthenticated, async (req, res) => {
  try {
    await ListLoanById(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.put("/loans/edit-loan/:id", isAuthenticated, async (req, res) => {
  try {
    await EditLoan(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/loans/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await DeleteLoan(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/loans", isAuthenticatedWithLessOptions, async (req, res) => {
  try {
    await GetAllLoans(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/books/:id", isAuthenticatedWithLessOptions, async (req, res) => {
  try {
    GetSingleLoan(req, res);
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
