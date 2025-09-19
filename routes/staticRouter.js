const express = require("express");
const URL = require("../models/url");
const router = express.Router();

const { checkAuthentication } = require("../middlewares/auth");

router.get("/home", checkAuthentication, async (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  }

  const URLsCreatedByUser = await URL.find({ createdBy: req.user._id });
  res.render("index", {
    urls: URLsCreatedByUser,
    req,
  });
});

router.get("/", (req, res) => {
  if (!req.user) {
    return res.redirect("/login");
  } else {
    return res.redirect("/home");
  }
});

router.get("/signup", async (req, res) => {
  if (!req.user) {
    return res.render("signup");
  } else {
    res.redirect("/home");
  }
});

router.get("/login", async (req, res) => {
  if (!req.user) {
    return res.render("login");
  } else {
    res.redirect("/home");
  }
});

module.exports = router;
