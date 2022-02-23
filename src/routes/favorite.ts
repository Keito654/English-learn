import express from "express";
export const router = express.Router();
import { Favorite } from "../models/favorite";
import { Word } from "../models/word";
import { ensure } from "./authentication-ensurer";

/* GET home page. */
router.get("/", ensure, async (req: any, res: any, next: any) => {
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
  if (words.length === 0) {
    return res.render("favorite", { words: null, user: req.user });
  }
  res.render("favorite", { words: words, user: req.user });
});
