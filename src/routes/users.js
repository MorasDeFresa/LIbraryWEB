const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");
const { isAuthenticated } = require("../helpers/auth");

router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

router.post(
  "/users/signin",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/users/signin",
    failureFlash: true,
  })
);

router.get("/users/signup", isAuthenticated, (req, res) => {
  res.render("users/signup");
});

router.post("/users/signup", async (req, res) => {
  const { Username, Password, Confirm_Password } = req.body;
  const errors = [];
  if (Password != Confirm_Password) {
    errors.push({ text: "No coincide la contraseña" });
  }
  if (Password?.length < 4) {
    errors.push({ text: "La contraseña debe ser mayor a 4 caracteres" });
  }
  if (errors.length > 0) {
    res.render("users/signup", {
      errors,
      Username,
      Password,
      Confirm_Password,
    });
  } else {
    const UsernameRepeat = await User.findOne({ Username: Username }).lean();
    if (UsernameRepeat) {
      req.flash("error_msg", "El usuario ya esta en úso");
      res.redirect("/users/signup");
    }
    if (!UsernameRepeat) {
      const newUser = new User({ Username, Password, Confirm_Password });
      newUser.Password = await newUser.encryptPassword(Password);
      await newUser.save();
      req.flash("success_msg", "Has sido registrado");
      res.redirect("/");
    }
  }
});

router.get("/users/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "Se ha cerrado la sesión correctamente");
    res.redirect("/users/signin");
  });
});
module.exports = router;
