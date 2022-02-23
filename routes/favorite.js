var express = require("express");
var router = express.Router();
const Favorite = require("../models/favorite");
const Word = require("../models/word");
const authenticationEnsurer = require("./authentication-ensurer");

/* GET home page. */
router.get("/", authenticationEnsurer, async (req, res, next) => {
  const words = await Word.findAll({
    include: [
      {
        model: Favorite,
        where: {userId: req.user.userId || req.user},
        required: true,
      },
    ],
    order: [["wordId", "ASC"]],
  });
  if(words.length === 0){
    return res.render("favorite", { words: null, user: req.user });
  }
  res.render("favorite", { words: words, user: req.user });
});

module.exports = router;