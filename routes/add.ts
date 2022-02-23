"use strict";
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'express'.
const express = require("express");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'router'.
const router = express.Router();
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Word'.
const Word = require("../models/word");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'checkAdmin... Remove this comment to see the full error message
const checkAdmin = require('./checkAdmin');

router.get("/", checkAdmin, (req: any, res: any, next: any) => {
  res.render("add", { uesr: req.user });
});

router.post("/", checkAdmin, (req: any, res: any, next: any) => {
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;
