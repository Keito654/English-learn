"use strict";
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var bcrypt = require("bcrypt");

router.get("/", (req, res, next) => {
  res.render("newUser", { user: req.user });
});

router.post("/", async (req, res, next) => {
  const user = await User.findOne({
    where: { userId: req.body.username.trim() },
  });
  if (user === null) {
    const passAndHash = req.body.password + process.env.PASSWORD_HASH;
    const newUser = await User.create({
      userId: req.body.username.trim(),
      password: await bcrypt.hash(passAndHash, 10),
      rememberToken: null,
    });
    res.redirect("login");
  } else {
    res.render("newUser", { message: "そのIDはすでに使われています" });
  }
});

module.exports = router;
