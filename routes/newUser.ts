"use strict";
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'express'.
var express = require("express");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'router'.
var router = express.Router();
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'User'.
var User = require("../models/user");
// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
var bcrypt = require("bcrypt");

router.get("/", (req: any, res: any, next: any) => {
  res.render("newUser", { user: req.user });
});

router.post("/", async (req: any, res: any, next: any) => {
  const user = await User.findOne({
    where: { userId: req.body.username.trim() },
  });
  if (user === null) {
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;
