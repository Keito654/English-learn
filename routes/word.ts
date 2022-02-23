"use strict";
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'express'.
const express = require("express");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'router'.
const router = express.Router();
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Word'.
const Word = require("../models/word");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Favorite'.
const Favorite = require("../models/favorite");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationEnsurer = require("./authentication-ensurer");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'cloudinary... Remove this comment to see the full error message
const cloudinary = require("../cloudinary");

router.get("/:wordId", authenticationEnsurer, async (req: any, res: any, next: any) => {
  const word = await Word.findOne({
    where: {
      wordId: parseInt(req.params.wordId),
    },
  });
  if (word) {
    res.cookie("lastAccess", req.params.wordId, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // １週間
    });
    const wordNumber = ("000" + req.params.wordId).slice(-3);
    const audioSrc = {
      slow: cloudinary.url(`audio/duo_word_slow/英文01_${wordNumber}.mp3`, {
        version: "1635568542",
        resource_type: "video",
        sign_url: true,
        type: "authenticated",
      }),
      fast: cloudinary.url(`audio/duo_word_fast/英文02_${wordNumber}.mp3`, {
        version: "1635568542",
        resource_type: "video",
        sign_url: true,
        type: "authenticated",
      }),
    };
    const isFav = await Favorite.findAll({
      where: {
        userId: req.user.userId || req.user,
        wordId: parseInt(req.params.wordId),
      },
    });
    let checked;
    if (isFav.length === 0) {
    } else {
      checked = "checked";
    }
    res.render("word", {
      word: word,
      user: req.user,
      audioSrc: audioSrc,
      checked: checked,
    });
  } else {
    const err = new Error("指定された単語は見つかりません");
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type 'Error'.
    err.status = 404;
    next(err);
  }
});

router.post("/", authenticationEnsurer, async (req: any, res: any, next: any) => {
  //お気に入り機能　JQueryでpostを受け取りfaboriteテーブルに入れる
  const wordId = parseInt(req.body.wordId);
  const favoritebool = req.body.favoritebool;
  const userId = req.user.userId || req.user;

  if (favoritebool === "true") {
    //チェックが入ったとき
    const [word, created] = await Favorite.findOrCreate({
      where: { userId: userId, wordId: wordId },
      defaults: { userId: userId, wordId: wordId },
    });
    if (created) res.json({ status: "OK" });
  } else if (favoritebool === "false") {
    const userFav = await Favorite.findOne({
      where: {
        userId: userId,
        wordId: wordId,
      },
    });
    if (userFav === null) {
      return;
    } else {
      userFav.destroy();
      res.json({ status: "OK" });
    }
  }
});

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;
