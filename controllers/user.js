const User = require("../models/user");
const { setUser } = require("../service/auth");
const bcrypt = require("bcryptjs");

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashed,
  });

  const token = setUser(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.redirect("/home");
}

async function handleUserSignIn(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.render("login", {
      error: "Invalid username or password",
    });
  }
  const token = setUser(user);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.redirect("/home");
}

module.exports = {
  handleUserSignUp,
  handleUserSignIn,
};
