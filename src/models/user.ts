"use strict";
import { sequelize } from "./sequelize-loader";
import { DataTypes } from "sequelize";

export const User = sequelize.define(
  "users",
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rememberToken: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
