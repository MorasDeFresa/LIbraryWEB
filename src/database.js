require("dotenv").config();
const mongoose = require("mongoose");

mongoose
  .connect(process.env.mongo_database)
  .then((db) => console.log("Db esta conectada"))
  .catch((err) => console.log("Err"));
