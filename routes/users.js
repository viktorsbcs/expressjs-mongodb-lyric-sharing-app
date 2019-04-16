const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

require("../models/User");
const User = mongoose.model("users");

//user login route
router.get("/login", (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("users/login");
  } else {
    //req.flash("error_msg", "You must Logout first!");
    res.redirect("/lyrics");
  }
});

router.post("/login", (req, res, next) => {
  if (!req.isAuthenticated()) {
    passport.authenticate("local", {
      successRedirect: "/lyrics/my",
      failureRedirect: "/users/login",
      failureFlash: true
    })(req, res, next);
  } else {
    req.flash("error_msg", "You must Logout first!");
    res.redirect("/lyrics");
  }
});

router.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    req.flash("success_msg", "You are logged out!");
    res.redirect("/users/login");
  } else {
    req.flash("error_msg", "You must Logout first!");
    res.redirect("/lyrics");
  }
});

//users register route
router.get("/register", (req, res) => {
  if (!req.isAuthenticated()) {
    res.render("users/register");
  } else {
    req.flash("error_msg", "You must Logout first!");
    res.redirect("/lyrics");
  }
});

router.post("/register", (req, res) => {
  let errors = [];

  if (!req.isAuthenticated()) {
    if (req.body.password != req.body.password2) {
      errors.push({ text: "Passwords do not match!" });
    }

    if (req.body.password.length < 4) {
      errors.push({ text: "Password must be atleast 4 characters" });
    }

    if (errors.length > 0) {
      res.render("users/register", {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        password2: req.body.password2,
        errors: errors
      });
    } else {
      User.findOne({
        email: req.body.email
      }).then(user => {
        if (user) {
          req.flash("error_msg", "Email already exists");
          res.redirect("/users/register");
        } else {
          const newUser = new User({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;

              newUser
                .save()
                .then(user => {
                  req.flash(
                    "success_msg",
                    "You are now registered and can login!"
                  );
                  res.redirect("/users/login");
                })
                .catch(err => {
                  console.log(err);
                  return;
                });
            });
          });
        }
      });
    }
  } else {
    req.flash("error_msg", "You must Logout first!");
    res.redirect("/lyrics");
  }
});
module.exports = router;
