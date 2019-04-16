const express = require("express");
const passport = require("passport");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const HandlebarsIntl = require("handlebars-intl");
const methodOverride = require("method-override");
const keys = require("./config/keys");
const flash = require("connect-flash");
const session = require("express-session");

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

//Load routes
const lyricsRoute = require("./routes/lyrics");
const usersRoute = require("./routes/users");

//Passport Config
require("./config/passport")(passport);

//Connect to mongoose
mongoose
  .connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Method override
app.use(methodOverride("_method"));

HandlebarsIntl.registerWith(Handlebars);

//expresss session middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
  })
);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

//Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
//Load Lyrics model

//Handlebars Middleware
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Passport config

//Load Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

//Use routes
app.use("/lyrics", lyricsRoute);
app.use("/users", usersRoute);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
