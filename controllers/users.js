const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/users");

const userRouter = express.Router();

// localhost:3000/users/signup
userRouter.get("/signup", (req, res) => {
  res.render("users/signup.ejs", {
    currentUser: req.session.currentUser,
    baseUrl: req.baseUrl,
    tabTitle: "Sign Up",
  });
});

userRouter.post("/", (req, res) => {
  //overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync());

  User.create(req.body)
    .then((newUser) => {
      console.log("created user is: ", newUser);
      res.redirect("/"); // app root ("home page") or somewhere else
    })
    .catch((err) => {
      req.flash("info", "Username already exists");
      res.redirect(req.baseUrl + "/signup");
      console.log("error");
    });
});

module.exports = userRouter;
