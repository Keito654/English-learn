"use strict";
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'express'.
var express = require("express");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'router'.
var router = express.Router();

router.get("/", (req: any, res: any, next: any) => {
  res.clearCookie("remember_me");
  req.logout();
  res.redirect("/login");
});

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;
