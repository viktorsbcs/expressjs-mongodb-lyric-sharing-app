module.exports = {
  redirect: (req, res, next) => {
    req.flash("error_msg", "Not Authorized");
    res.redirect("/users/login");
  }
};
