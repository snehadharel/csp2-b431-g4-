const passport = require("passport");

// Render the login page or redirect to Google login
const googleLogin = (req, res) => {
  res.redirect("/users/google");
};

// Handle Google callback after successful authentication
const googleCallback = (req, res) => {
  // Successful authentication, redirect home or to a specified page
  res.redirect("/");
};

module.exports = { googleLogin, googleCallback };
