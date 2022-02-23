"use strict";
import { sequelize } from "./sequelize-loader";
import { DataTypes } from "sequelize";

export const Favorite = sequelize.define(
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
