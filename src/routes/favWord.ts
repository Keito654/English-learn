"use strict";
import express from "express";
export const router = express.Router();
import { Word } from "../models/word";
import { Favorite } from "../models/favorite";
import { ensure } from "./authentication-ensurer";
import { cloudinary } from "../cloudinaryModule";

//お気に入り一覧画面からの各単語にアクセスするときのルーター
router.get("/:wordId", ensure, async (req: any, res: any, next: any) => {
  //お気に入りに登録された単語一覧を取得し、配列のままビューに渡す
  //ビューはその配列の一つ前、一つ後をボタンとして登録できる
  const words = await Word.findAll({
    include: [
      {
        model: Favorite,
        where: { userId: req.user.userId || req.user },
        required: true,
      },
    ],
    order: [["wordId", "ASC"]],
  });

  //URLのIDと同じ要素をもつwordを抜き出す
  //let num: number;
  // words.forEach((i: any) => {
  //   if (i.wordId === parseInt(req.params.wordId)) {
  //     num = words.indexOf(i);
  //   }
  // });

  const [word] = words.filter((w: any) => w.wordId === parseInt(req.params.wordId));

  //const word = words[num];

  //ワードが見つかれば処理をすすめる
  if (word) {
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

    //お気に入りに登録済みかどうか
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

    //wordのwords配列での添字を取得
    const num1 = words.indexOf(word);

    //次のワードの数字を計算する
    const page = {
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      pre: words[num - 1]?.wordId ?? null,
      // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
      next: words[num + 1]?.wordId ?? null,
    };

    res.render("favWord", {
      word: word,
      words: words,
      user: req.user,
      audioSrc: audioSrc,
      checked: checked,
      page: page,
    });
  } else {
    const err = new Error("指定された単語は見つかりません");
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'status' does not exist on type 'Error'.
    err.status = 404;
    next(err);
  }
});
