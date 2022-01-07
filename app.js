require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = new express();

app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/userDB");
// mongoose.connect(
//   "mongodb+srv://admin-admin:<Password>@cluster0.zosun.mongodb.net/userDB"
// );

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.post("/login", function (req, res) {
  let email = req.body.email;
  let password = md5(req.body.password);
  User.findOne({ email: email }, function (err, foundUser) {
    if (!err) {
      if (foundUser) {
        console.log(foundUser);
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
      console.log(err);
    } else {
      console.log(err);
    }
  });
});

app.get("/register", function (req, res) {
  res.render("register");
});

app.post("/register", function (req, res) {
  const newUser = new User({
    email: req.body.email,
    password: md5(req.body.password),
  });

  newUser.save(function (err) {
    if (!err) {
      res.render("secrets");
    } else {
      console.log("err");
      //   res.render("register");
    }
  });
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function () {
  console.log("Server started");
});
