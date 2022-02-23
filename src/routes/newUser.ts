"use strict";
import express from "express";

export const router = express.Router();

import { User } from "../models/user";
import bcrypt from "bcrypt";

router.get("/", (req: any, res: any, next: any) => {
  res.render("newUser", { user: req.user });
});

router.post("/", async (req: any, res: any, next: any) => {
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
