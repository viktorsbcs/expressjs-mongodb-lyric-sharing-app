const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

require("../models/Lyrics");
const Lyrics = mongoose.model("lyrics");

require("../models/User");
const Users = mongoose.model("users");

router.get("/add", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("addLyrics");
  } else {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
});

router.get("/edit/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Lyrics.findOne({
      _id: req.params.id
    }).then(lyrics => {
      if (lyrics.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        res.redirect("/lyrics");
      } else {
        res.render("editLyrics", {
          lyrics: lyrics
        });
      }
    });
  } else {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
});

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    Lyrics.find({})
      .sort({ date: "desc" })
      .then(lyrics => {
        res.render("listLyrics", {
          lyrics: lyrics
        });
      });
  } else {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
});

router.get("/my", (req, res) => {
  if (req.isAuthenticated()) {
    Lyrics.find({ user: req.user.id })
      .sort({ date: "desc" })
      .then(lyrics => {
        res.render("myLyrics", {
          lyrics: lyrics
        });
      });
  } else {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
});

//Add new lyric idea
router.post("/", (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({ text: "Please, add a song title!" });
  }

  if (!req.body.lyrics) {
    errors.push({ text: "Please, add a song lyrics!" });
  }

  if (errors.length > 0) {
    res.render("addLyrics", {
      title: req.body.title,
      lyrics: req.body.lyrics,
      errors: errors
    });
  } else {
    if (req.isAuthenticated()) {
      const newIdea = {
        title: req.body.title,
        lyrics: req.body.lyrics,
        user: req.user.id,
        userName: req.user.name
      };

      new Lyrics(newIdea).save().then(lyrics => {
        res.redirect("/lyrics/my");
      });
    } else {
      req.flash("error_msg", "Not Authorized");
      res.redirect("/users/login");
    }
  }
});

//Update lyrics
router.put("/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Lyrics.findOne({
      _id: req.params.id
    }).then(lyrics => {
      lyrics.title = req.body.title;
      lyrics.lyrics = req.body.lyrics;

      lyrics.save().then(lyrics => {
        req.flash("success_msg", "Lyric idea edited");

        res.redirect("/lyrics/my");
      });
    });
  } else {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
});

//Delete lyrics
router.delete("/:id", (req, res) => {
  if (req.isAuthenticated()) {
    Lyrics.findOne({
      _id: req.params.id
    }).then(lyrics => {
      if (lyrics.user != req.user.id) {
        req.flash("error_msg", "Not Authorized");
        res.redirect("/lyrics");
      } else {
        Lyrics.deleteOne({ _id: req.params.id }).then(() => {
          req.flash("success_msg", "Lyric idea removed");
          res.redirect("/lyrics");
        });
      }
    });
  } else {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
});

module.exports = router;
