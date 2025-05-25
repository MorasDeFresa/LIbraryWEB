const GenreDB = require("../models/Genre");
const PublisherDB = require("../models/Publisher");
const Books = require("../models/Book");
const { verifyImageURL } = require("verify-image-url");

const ListGenresPublishers = async (res) => {
  const Genres = await GenreDB.find().lean().sort({ Genre: "ascending" });
  const Publishers = await PublisherDB.find()
    .lean()
    .sort({ Publisher: "ascending" });
  res.render("books/create_books", { Genres, Publishers });
};

const CreateBooks = async (req, res) => {
  const {
    NameGenre,
    Description,
    NamePublisher,
    Adress,
    Celphone,
    Name,
    Author,
    Genre,
    Cover,
    Publisher,
    Summary,
  } = req.body;
  const Book = await Books.findOne({ Name: Name }).lean();
  const Img = await verifyImageURL(Cover);
  const errors = [];
  if (Book) {
    errors.push({ text: "Libro ya existente" });
  }
  if (Img.isImage == false) {
    errors.push({ text: "URL de portada no valida" });
  }

  if (errors.length > 0) {
    const Genres = await GenreDB.find().lean().sort({ NameGenre: "ascending" });
    const Publishers = await PublisherDB.find()
      .lean()
      .sort({ Publisher: "ascending" });
    res.render("books/create_books", {
      errors,
      Genres,
      NameGenre,
      Description,
      Publishers,
      NamePublisher,
      Adress,
      Celphone,
      Name,
      Author,
      Genre,
      Cover,
      Publisher,
      Summary,
    });
  } else {
    const newBook = new Books({
      Name,
      Author,
      Genre,
      Cover,
      Publisher,
      Summary,
    });
    await newBook.save();
    req.flash("success_msg", "El nuevo libro se registro exitosamente");
    res.redirect("/books/add");
  }
};

const CreateGenres = async (req, res) => {
  const {
    NameGenre,
    Description,
    NamePublisher,
    Adress,
    Celphone,
    Name,
    Author,
    Genre,
    Cover,
    Publisher,
    Summary,
  } = req.body;
  const Genres = await GenreDB.findOne({ NameGenre: NameGenre }).lean();
  const errors = [];
  if (Genres) {
    errors.push({ text: "Género ya existente" });
  }

  if (errors.length > 0) {
    const Genres = await GenreDB.find().lean().sort({ Genre: "ascending" });
    const Publishers = await PublisherDB.find()
      .lean()
      .sort({ Publisher: "ascending" });
    res.render("books/create_books", {
      errors,
      Genres,
      NameGenre,
      Description,
      Publishers,
      NamePublisher,
      Adress,
      Celphone,
      Name,
      Author,
      Genre,
      Cover,
      Publisher,
      Summary,
    });
  } else {
    const newGenre = new GenreDB({ NameGenre, Description });
    await newGenre.save();
    req.flash("success_msg", "El nuevo género se registro exitosamente");
    res.redirect("/books/add");
  }
};

const CreatePublishers = async (req, res) => {
  const {
    NameGenre,
    Description,
    NamePublisher,
    Adress,
    Celphone,
    Name,
    Author,
    Genre,
    Cover,
    Publisher,
    Summary,
  } = req.body;
  const Publishers = await PublisherDB.findOne({
    NamePublisher: NamePublisher,
  }).lean();
  const errors = [];
  if (Publishers) {
    errors.push({ text: "Editorial ya existente" });
  }

  if (errors.length > 0) {
    const Genres = await GenreDB.find().lean().sort({ Genre: "ascending" });
    const Publishers = await PublisherDB.find()
      .lean()
      .sort({ Publisher: "ascending" });
    res.render("books/create_books", {
      errors,
      Genres,
      NameGenre,
      Description,
      Publishers,
      NamePublisher,
      Adress,
      Celphone,
      Name,
      Author,
      Genre,
      Cover,
      Publisher,
      Summary,
    });
  } else {
    const newPublisher = new PublisherDB({ NamePublisher, Adress, Celphone });
    await newPublisher.save();
    req.flash("success_msg", "La nueva editorial se registro exitosamente");
    res.redirect("/books/add");
  }
};

const ListBookById = async (req, res) => {
  const book = await Books.findById(req.params.id).lean();
  const Genre = await GenreDB.findOne({ NameGenre: book.Genre }).lean();
  const Publisher = await PublisherDB.findOne({
    NamePublisher: book.Publisher,
  }).lean();
  const Genres = await GenreDB.find().lean().sort({ Genre: "ascending" });
  const Publishers = await PublisherDB.find()
    .lean()
    .sort({ Publisher: "ascending" });
  res.render("books/edit_books", {
    book,
    Genres,
    Publishers,
    Genre,
    Publisher,
  });
};

const EditBook = async (req, res) => {
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
};

const DeleteBook = async (req, res) => {
  await Books.findByIdAndDelete(req.params.id).lean();
  req.flash("success_msg", "Libro eliminado satisfactoriamente");
  res.redirect("/books");
};

const EditGenre = async (req, res) => {
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
};

const EditPublisher = async (req, res) => {
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
};

const GetAllBooks = async (req, res) => {
  const book = await Books.find().lean().sort({ Name: "ascending" });
  const user = res.locals.isAuthenticated;
  res.render("books/view_books", { book, user });
};

const GetSingleBook = async (req, res) => {
  const book = await Books.findById(req.params.id).lean();
  const user = res.locals.isAuthenticated;
  res.render("books/view_single_book", { book, user });
};

module.exports = {
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
};
