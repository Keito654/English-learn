"use strict";
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

module.exports = Word;
