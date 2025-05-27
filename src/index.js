const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const session = require("express-session");
const exphbs = require("express-handlebars");
const flash = require("connect-flash");
const passport = require("passport");
const dotenv = require("dotenv");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./.env.production" });
} else {
  dotenv.config({ path: "./.env.development" });
}

// Initializations
const app = express();
require("./database");
require("./config/passport");

// Settings
app.set("port", process.env.PORT || 3000);
console.log("Server en el puerto ", app.get("port"));
app.set("views", path.join(__dirname, "views"));

// Configuración de Handlebars con el helper ifEquals
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: {
      ifEquals: function (arg1, arg2, options) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
      },
    },
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Routes
app.use(require("./routes/index"));
app.use(require("./routes/users"));
app.use(require("./routes/books"));
app.use(require("./routes/authors"));
app.use(require("./routes/loans"));

// Static Files
app.use(express.static(path.join(__dirname, "public")));

// Server is listening
app.listen(app.get("port"), () => {
  console.log("El server esta en el puerto: ", app.get("port"));
});
