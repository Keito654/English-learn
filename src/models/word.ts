"use strict";
import { sequelize } from "./sequelize-loader";
import { DataTypes } from "sequelize";

export const Word = sequelize.define(
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
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
