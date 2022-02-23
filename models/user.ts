"use strict";
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sequelize'... Remove this comment to see the full error message
const { sequelize, DataTypes } = require("./sequelize-loader");

const User = sequelize.define(
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

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = User;
