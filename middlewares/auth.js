const { getUser } = require("../service/auth");

function restrictToLoggedInUsersOnly(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  const user = getUser(token);
  if (!user) return res.redirect("/login");

  req.user = user;
  next();
}

function checkAuthentication(req, res, next) {
  const token = req.cookies.token;
  if (token) {
    const user = getUser(token);
    req.user = user;
  }
  next();
}

module.exports = { restrictToLoggedInUsersOnly, checkAuthentication };
