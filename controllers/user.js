const User = require("../models/user");
const { setUser } = require("../service/auth");
const bcrypt = require("bcryptjs");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score < 3) return "weak";
  if (score < 5) return "medium";
  return "strong";
}

async function handleUserSignUp(req, res) {
  const { name, email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.render("signup", {
      error: "Please enter a valid email address",
    });
  }

  const passwordStrength = getPasswordStrength(password);
  if (passwordStrength === "weak") {
    return res.render("signup", {
      error:
        "Password must be medium or strong strength. Include uppercase, lowercase, numbers, and special characters.",
    });
  }

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
  return res.redirect("/login");
}

async function handleUserSignIn(req, res) {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    return res.render("login", {
      error: "Please enter a valid email address",
    });
  }

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
