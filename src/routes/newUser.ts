"use strict";
import express, { Request, Response } from "express";

export const router = express.Router();

import { User } from "../models/user";
import bcrypt from "bcrypt";

router.get("/", (req: Request, res: Response) => {
  res.render("newUser", { user: req.user });
});

router.post("/", async (req: Request, res: Response) => {
  const user = await User.findOne({
    where: { userId: req.body.username.trim() },
  });

  if (req.body.password !== req.body.rePassword) {
    res.render("newUser", {
      message: "入力された2つのパスワードが異なります。",
    });
    return;
  }

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
