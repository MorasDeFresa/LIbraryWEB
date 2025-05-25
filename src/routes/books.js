const router = require("express").Router();
const {
  isAuthenticated,
  isAuthenticatedWithLessOptions,
} = require("../helpers/auth");
const {
  ListGenresPublishers,
  CreateBooks,
  CreateGenres,
  CreatePublishers,
  ListBookById,
  EditBook,
  DeleteBook,
  EditGenre,
  EditPublisher,
  GetAllBooks,
  GetSingleBook,
} = require("../controllers/books");

router.get("/books/add", isAuthenticated, async (req, res) => {
  try {
    await ListGenresPublishers(res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/books/add", isAuthenticated, async (req, res) => {
  try {
    await CreateBooks(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/books/genres/add", async (req, res) => {
  try {
    await CreateGenres(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/books/publishers/add", async (req, res) => {
  try {
    await CreatePublishers(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/books/edit/:id", isAuthenticated, async (req, res) => {
  try {
    await ListBookById(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.put("/books/edit-book/:id", isAuthenticated, async (req, res) => {
  try {
    await EditBook(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.delete("/books/delete/:id", isAuthenticated, async (req, res) => {
  try {
    await DeleteBook(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.put("/books/edit-genre/:id", isAuthenticated, async (req, res) => {
  try {
    await EditGenre(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.put("/books/edit-publisher/:id", isAuthenticated, async (req, res) => {
  try {
    EditPublisher(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/books", isAuthenticatedWithLessOptions, async (req, res) => {
  try {
    GetAllBooks(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/books/:id", isAuthenticatedWithLessOptions, async (req, res) => {
  try {
    GetSingleBook(req, res);
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
