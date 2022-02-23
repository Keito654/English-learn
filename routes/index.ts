var express = require("express");
var router = express.Router();
const Word = require("../models/word");
const authenticationEnsurer = require("./authentication-ensurer");

/* GET home page. */
router.get("/", authenticationEnsurer, async (req, res, next) => {
  const words = await Word.findAll({
    order: [["wordId", "ASC"]],
  });
  const lastAccess = req.cookies.lastAccess;
  res.render("index", { words: words, user: req.user, lastAccess: lastAccess });
});

module.exports = router;
