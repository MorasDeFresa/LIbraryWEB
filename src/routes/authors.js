const router = require("express").Router();
const {
  isAuthenticated,
  isAuthenticatedWithLessOptions,
} = require("../helpers/auth");
const {
  ListAuthors,
  CreateAuthor,
  GetAuthorById,
  EditAuthor,
  DeleteAuthor,
} = require("../controllers/author");

router.get("/authors", isAuthenticatedWithLessOptions, async (req, res) => {
  try {
    await ListAuthors(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/authors/add", isAuthenticated, async (req, res) => {
  try {
    res.render("authors/create_author");
  } catch (error) {
    console.error(error);
  }
});

router.post("/authors/add", isAuthenticated, async (req, res) => {
  try {
    await CreateAuthor(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/authors/edit/:id", isAuthenticated, async (req, res) => {
  try {
    await GetAuthorById(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.put("/authors/edit/:id", isAuthenticated, async (req, res) => {
  try {
    await EditAuthor(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/authors/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await DeleteAuthor(req, res);
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
