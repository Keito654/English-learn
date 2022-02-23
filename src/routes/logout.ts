"use strict";
import express from "express";

export const router = express.Router();

router.get("/", (req: any, res: any, next: any) => {
  res.clearCookie("remember_me");
  req.logout();
  res.redirect("/login");
});
