"use strict";
var express = require("express");
var router = express.Router();

router.get("/", (req, res, next) => {
  res.clearCookie("remember_me");
  req.logout();
  res.redirect("/login");
});

module.exports = router;
