"use strict";
import $ from "jquery";
globalThis.jQuery = $;
import { Tooltip, Toast, Popover } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const $bgm = $("#bgm");
const $bgm_fast = $("#bgm_fast");

$("#btn-play").on("click", () => {
  $bgm.get(0).play();
});

$("#btn-play-fast").on("click", () => {
  $bgm_fast.get(0).play();
});

$bgm.on("play", () => {
  $("#btn-play-fast").prop("disabled", true);
});

$bgm.on("ended", () => {
  $("#btn-play-fast").prop("disabled", false);
});

$bgm_fast.on("play", () => {
  $("#btn-play").prop("disabled", true);
});

$bgm_fast.on("ended", () => {
  $("#btn-play").prop("disabled", false);
});

$('#add-text').attr('placeholder', '英単語 1個目\r\n日本語訳 1個\r\n\r\n英単語 2個目\r\n日本語訳 2個目\r\n\r\n英単語 3個目\r\n...');

const fav = $("#favoriteCheck");
fav.on("click", () => {
  const wordId = fav.data("wordid");
  if (fav.prop("checked")) {
    $.post(`/word`, { favoritebool: true, wordId: wordId }, (data) => {
      fav.attr("checked");
    });
  } else if (!fav.prop("checked")) {
    $.post(`/word`, { favoritebool: false, wordId: wordId }, (data) => {});
  }
});
