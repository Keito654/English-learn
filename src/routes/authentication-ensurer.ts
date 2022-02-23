"use strict";
import { User } from "../models/user";
import crypto from "crypto";

export async function ensure(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    return next();
  } else if (req.cookies.remember_me) {
    const [rememberToken, hash] = req.cookies.remember_me.split("|");
    const users = await User.findAll({
      where: {
        rememberToken: rememberToken,
      },
    }); //送られたきたクッキーの情報から合致するユーザーを探す

    for (let i in users) {
      const user = users[i];
      const verifyingHash = crypto
        // @ts-expect-error ts-migrate(2339) FIXME: Property 'createHmac' does not exist on type 'Cryp... Remove this comment to see the full error message
        .createHmac("sha256", process.env.APP_KEY)
        .update(user.userId + "-" + rememberToken) //ユーザーIDとクッキーからhashになるべきものを作成
        .digest("hex");

      if (hash === verifyingHash) {
        return req.login(user, () => {
          const user = req.user;
          const rememberToken = crypto.randomBytes(20).toString("hex"); // ランダムな文字列
          const hash = crypto
            .createHmac("sha256", process.env.APP_KEY)
            .update(user.userId + "-" + rememberToken)
            .digest("hex");
          User.update(
            { rememberToken: rememberToken },
            { where: { userId: user.userId } }
          );
          res.clearCookie("remember_me");
          res.cookie("remember_me", rememberToken + "|" + hash, {
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000, // １週間
          });

          return next();
        });
      }
    }
    res.redirect(302, "/login");
  } else {
    res.redirect(302, "/login");
  }
}
