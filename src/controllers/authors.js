const AuthorDB = require("../models/Authors");
const Books = require("../models/Book");
const ListAuthors = async (req, res) => {
  const authors = await AuthorDB.find().lean().sort({ NameAutor: "ascending" });
  res.render("authors/view_authors", { authors });
};

const CreateAuthor = async (req, res) => {
  const { NameAutor, LastNameAutor, EmailAutor } = req.body;
  const existingAuthor = await AuthorDB.findOne({ EmailAutor }).lean();
  const errors = [];

  if (existingAuthor) {
    errors.push({ text: "Autor ya registrado con ese correo" });
  }

  if (errors.length > 0) {
    res.render("authors/create_author", {
      errors,
      NameAutor,
      LastNameAutor,
      EmailAutor,
    });
  } else {
    const newAuthor = new AuthorDB({ NameAutor, LastNameAutor, EmailAutor });
    await newAuthor.save();
    req.flash("success_msg", "Autor registrado exitosamente");
    res.redirect("/books/add");
  }
};

const GetAuthorById = async (req, res) => {
  const author = await AuthorDB.findById(req.params.id).lean();
  res.render("authors/edit_author", { author });
};

const EditAuthor = async (req, res) => {
  const { NameAutor, LastNameAutor, EmailAutor } = req.body;

  const aux = await AuthorDB.findByIdAndUpdate(req.params.id, {
    NameAutor,
    LastNameAutor,
    EmailAutor,
  }).lean();
  await Books.updateMany(
    { Author: aux.NameAutor },
    { $set: { Author: NameAutor } }
  ).lean();
  req.flash("success_msg", "Autor actualizado satisfactoriamente");
  res.redirect("/books");
};

const DeleteAuthor = async (req, res) => {
  await AuthorDB.findByIdAndDelete(req.params.id).lean();
  req.flash("success_msg", "Autor eliminado satisfactoriamente");
  res.redirect("/authors");
};

module.exports = {
  ListAuthors,
  CreateAuthor,
  GetAuthorById,
  EditAuthor,
  DeleteAuthor,
};
