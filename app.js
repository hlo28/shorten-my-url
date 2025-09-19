require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const mongoose = require("mongoose");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const {
  restrictToLoggedInUsersOnly,
  checkAuthentication,
} = require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT || 3000;
const url = process.env.MONGO_URL;
if (!url) {
  console.error("MONGO_URL not set");
  process.exit(1);
}
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET not set");
  process.exit(1);
}
mongoose
  .connect(url)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Mongo error", err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", staticRoute);
app.use("/", userRoute);
app.use("/url", urlRoute);

app.get("/health", (req, res) => {
  res.status(200).send("ok");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
