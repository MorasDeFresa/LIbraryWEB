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
} = require("../controllers/books");

router.get("/books/add", isAuthenticated, async (req, res) => {
  try {
    ListGenresPublishers(res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/books/add", isAuthenticated, async (req, res) => {
  try {
    CreateBooks(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/books/genres/add", async (req, res) => {
  try {
    CreateGenres(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.post("/books/publishers/add", async (req, res) => {
  try {
    CreatePublishers(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/books/edit/:id", isAuthenticated, async (req, res) => {
  try {
    ListBookById(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.put("/books/edit-book/:id", isAuthenticated, async (req, res) => {
  const { Name, Author, Genre, Cover, Publisher, Summary } = req.body;
  await Books.findByIdAndUpdate(req.params.id, {
    Name,
    Author,
    Genre,
    Cover,
    Publisher,
    Summary,
  }).lean();
  req.flash("success_msg", "Libro actualizado satisfactoriamente");
  res.redirect("/books");
});

router.delete("/books/delete/:id", isAuthenticated, async (req, res) => {
  await Books.findByIdAndDelete(req.params.id).lean();
  req.flash("success_msg", "Libro eliminado satisfactoriamente");
  res.redirect("/books");
});

router.put("/books/edit-genre/:id", isAuthenticated, async (req, res) => {
  const { NameGenre, Description } = req.body;
  const aux = await GenreDB.findByIdAndUpdate(req.params.id, {
    NameGenre,
    Description,
  }).lean();
  await Books.updateMany(
    { Genre: aux.NameGenre },
    { $set: { Genre: NameGenre } }
  ).lean();
  req.flash("success_msg", "Género actualizado satisfactoriamente");
  res.redirect("/books");
});

router.put("/books/edit-publisher/:id", isAuthenticated, async (req, res) => {
  const { NamePublisher, Adress, Celphone } = req.body;
  const aux = await PublisherDB.findByIdAndUpdate(req.params.id, {
    NamePublisher,
    Adress,
    Celphone,
  }).lean();
  await Books.updateMany(
    { Publisher: aux.NamePublisher },
    { $set: { Publisher: NamePublisher } }
  ).lean();
  req.flash("success_msg", "Editorial actualizado satisfactoriamente");
  res.redirect("/books");
});

router.get("/books", isAuthenticatedWithLessOptions, async (req, res) => {
  const book = await Books.find().lean().sort({ Name: "ascending" });
  const user = res.locals.isAuthenticated;
  res.render("books/view_books", { book, user });
});

router.get("/books/:id", isAuthenticatedWithLessOptions, async (req, res) => {
  const book = await Books.findById(req.params.id).lean();
  const user = res.locals.isAuthenticated;
  res.render("books/view_single_book", { book, user });
});
module.exports = router;
