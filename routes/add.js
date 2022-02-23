"use strict";
const express = require("express");
const router = express.Router();
const Word = require("../models/word");
const checkAdmin = require('./checkAdmin');

router.get("/", checkAdmin, (req, res, next) => {
  res.render("add", { uesr: req.user });
});

router.post("/", checkAdmin, (req, res, next) => {
  const wordsContent = req.body.addWords.split("\r\n\r\n");
  const words = wordsContent.map((w) => {
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

module.exports = router;
