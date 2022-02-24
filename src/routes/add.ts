"use strict";

import express from "express";

export const router = express.Router();

import { Word } from "../models/word";
import { ensure } from "./authentication-ensurer";

router.get("/", ensure, (req: any, res: any) => {
  res.render("add", { user: req.user });
});

router.post("/", ensure, async (req: any, res: any) => {
  const wordsContent = req.body.addWords.split("\r\n\r\n");
  const wordsArray = wordsContent.map((w: any) => {
    const wordsSplit = w.split("\r\n");
    return {
      wordContent: wordsSplit[0],
      wordTranslate: wordsSplit[1],
      userId: req.user.userId,
    };
  });

  const lastWord: any = await Word.findAll({
    limit: 1,
    where: {
      userId: req.user.userId,
    },
    order: [["wordId", "DESC"]],
  });

  let lastWordId: number;
  lastWord.forEach((word: any) => {
    lastWordId = word.wordId;
  });

  const words = wordsArray.map((w: any, i: number) => {
    return {
      ...w,
      wordId: i + lastWordId + 1,
    };
  })

  Word.bulkCreate(words).then(() => {
    res.redirect("/");
  });
});
