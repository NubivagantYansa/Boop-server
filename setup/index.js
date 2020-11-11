const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

module.exports = (app) => {
  app.use(logger("dev"));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  //CORS configuration
  app.use(
    cors({
      credentials: true,
      origin: process.env.ORIGIN,
    })
  );
};
