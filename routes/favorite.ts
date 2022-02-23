// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'express'.
var express = require("express");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'router'.
var router = express.Router();
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Favorite'.
const Favorite = require("../models/favorite");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'Word'.
const Word = require("../models/word");
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'authentica... Remove this comment to see the full error message
const authenticationEnsurer = require("./authentication-ensurer");

/* GET home page. */
router.get("/", authenticationEnsurer, async (req: any, res: any, next: any) => {
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = router;