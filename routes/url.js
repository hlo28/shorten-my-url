const express = require("express");
const router = express.Router();

const {
  handleGenerateNewShortURL,
  handleRedirectNewShortURL,
  handleAnalyticsURL,
} = require("../controllers/url");
const { restrictToLoggedInUsersOnly } = require("../middlewares/auth");

router.post("/", restrictToLoggedInUsersOnly, handleGenerateNewShortURL);
router.get("/:shortID", handleRedirectNewShortURL);
router.get("/analytics/:shortID", handleAnalyticsURL);

module.exports = router;
