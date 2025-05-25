const mongoose = require("mongoose");
const { Schema } = mongoose;

const Autor_Schema = new Schema({
  NameAutor: { type: String, required: true },
  LastNameAutor: { type: String, required: true },
  EmailAutor: { type: String, required: true },
});

module.exports = mongoose.model("Authors", Autor_Schema);
