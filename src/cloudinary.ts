"use strict";
import cloudinaryModule from "cloudinary";
import dotenv from "dotenv";

export const cloudinary = cloudinaryModule.v2;

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true,
});
