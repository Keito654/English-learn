"use strict";
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sequelize'... Remove this comment to see the full error message
const { sequelize, DataTypes } = require("./sequelize-loader");

const Word = sequelize.define(
  "words",
  {
    wordId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    wordContent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wordTranslate: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Word;
