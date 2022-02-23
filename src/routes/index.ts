import express from "express";
export const router = express.Router();

import { Word } from "../models/word";
import { ensure } from "./authentication-ensurer";

/* GET home page. */
router.get("/", ensure, async (req: any, res: any, next: any) => {
  const words = await Word.findAll({
    order: [["wordId", "ASC"]],
  });
  const lastAccess = req.cookies.lastAccess;
  res.render("index", { words: words, user: req.user, lastAccess: lastAccess });
});


