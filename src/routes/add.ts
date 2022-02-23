"use strict";

import express, { Request, Response } from "express";

export const router = express.Router();

import { Word } from "../models/word";
import { checkAdmin } from "./checkAdmin";

router.get("/", checkAdmin, (req: Request, res: Response) => {
  res.render("add", { uesr: req.user });
});

router.post("/", checkAdmin, (req: Request, res: Response) => {
  const wordsContent = req.body.addWords.split("\r\n\r\n");
  const words = wordsContent.map((w: any) => {
    const wordsSplit = w.split("\r\n");
    return {
      wordContent: wordsSplit[0],
      wordTranslate: wordsSplit[1],
    };
  });
  for (let i = 0; i < words.length; i++) {
    words[i].wordId = i + 1;
  }
  Word.bulkCreate(words).then(() => {
    res.redirect("/");
  });
});
