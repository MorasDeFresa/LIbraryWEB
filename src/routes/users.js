const router = require("express").Router();
const { isAuthenticated } = require("../helpers/auth");
const passport = require("passport");
const { CreateSession, CloseSession } = require("../controllers/users");

router.get("/users/signin", (req, res) => {
  try {
    res.render("users/signin");
  } catch (error) {
    console.error(error);
  }
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
  try {
    res.render("users/signup");
  } catch (error) {
    console.error(error);
  }
});

router.post("/users/signup", async (req, res) => {
  try {
    await CreateSession(req, res);
  } catch (error) {
    console.error(error);
  }
});

router.get("/users/logout", (req, res) => {
  try {
    CloseSession(req, res);
  } catch (error) {
    console.error(error);
  }
});
module.exports = router;
