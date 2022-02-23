import express from "express";
export const router = express.Router();
import passport from "passport";
import { User } from "../models/User";
import crypto from "crypto";

router.get("/", (req: any, res: any, next: any) => {
  res.render("login", { user: req.user });
});

router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/login",
    session: true,
    failureFlash: true,
  }),
  (req: any, res: any, next: any) => {
    if (!req.body.remember) {
      // 次回もログインを省略しない場合
      res.clearCookie("remember_me");
      return next();
    }

    const user = req.user;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'randomBytes' does not exist on type 'Cry... Remove this comment to see the full error message
    const rememberToken = crypto.randomBytes(20).toString("hex"); // ランダムな文字列
    const hash = crypto
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'createHmac' does not exist on type 'Cryp... Remove this comment to see the full error message
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
  (req: any, res: any, next: any) => {
    res.redirect("/");
  }
);
