"use strict";
import { Sequelize } from "sequelize";
export const dialectOptions = {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
};

export const sequelize = process.env.DATABASE_URL ?
  // 本番環境
  new Sequelize(
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
