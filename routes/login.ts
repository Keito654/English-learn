var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
const crypto = require("crypto");

router.get("/", (req, res, next) => {
  res.render("login", { user: req.user });
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    session: true,
    failureFlash: true,
  }),
  (req, res, next) => {
    if (!req.body.remember) {
      // 次回もログインを省略しない場合
      res.clearCookie("remember_me");
      return next();
    }

    const user = req.user;
    const rememberToken = crypto.randomBytes(20).toString("hex"); // ランダムな文字列
    const hash = crypto
      .createHmac("sha256", process.env.APP_KEY)
      .update(user + "-" + rememberToken)
      .digest("hex");
    User.update({ rememberToken: rememberToken }, { where: { userId: user } });

    res.cookie("remember_me", rememberToken + "|" + hash, {
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // １週間
    });

    return next();
  },
  (req, res, next) => {
    res.redirect("/");
  }
);

module.exports = router;
