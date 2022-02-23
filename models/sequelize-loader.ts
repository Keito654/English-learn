"use strict";
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'DataTypes'... Remove this comment to see the full error message
const { Sequelize, DataTypes } = require("sequelize");
const dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};
// @ts-expect-error ts-migrate(2451) FIXME: Cannot redeclare block-scoped variable 'sequelize'... Remove this comment to see the full error message
const sequelize = process.env.DATABASE_URL ?
  // 本番環境
  new Sequelize(
    // @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'process'. Do you need to install... Remove this comment to see the full error message
    process.env.DATABASE_URL,
    {
      logging: false,
      dialectOptions
    }
  )
  :
  // 開発環境
  new Sequelize(
      'postgres://postgres:postgres@db/english-study',
    {
      logging: false
    }
  );

// @ts-expect-error ts-migrate(2580) FIXME: Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  sequelize,
  DataTypes,
};
