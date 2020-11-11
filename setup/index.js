const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const favicon = require("serve-favicon");

module.exports = (app) => {
  app.use(logger("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));
  //CORS configuration
  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
    })
  );
};
