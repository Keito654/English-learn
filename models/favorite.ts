"use strict";
const { sequelize, DataTypes } = require("./sequelize-loader");

const Favorite = sequelize.define(
  "favorites",
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    wordId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = Favorite;
