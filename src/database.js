require("dotenv").config();
const mongoose = require("mongoose");

if (process.env.NODE_ENV === "development") {
  mongoose
    .connect(process.env.mongo_database)
    .then((db) => console.log("Db esta conectada"))
    .catch((err) => console.log("Err"));
} else if (process.env.NODE_ENV === "production") {
  mongoose
    .connect(
      `mongodb://${process.env.mongo_user}:${process.env.mongo_password}@BuhoTeca_DataBase:27017/DB_Buhoteca?authSource=admin`
    )
    .then((db) => console.log("Mongo DB connected"))
    .catch((err) => console.log("Error connection MONGO DB"));
}
