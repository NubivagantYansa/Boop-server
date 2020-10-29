require("dotenv/config");
const express = require("express");
require("./config/db.config");

const app = express();
require("./setup/index")(app);

//Routers definition
app.get("/", (req, res) => res.json(true));
app.use("/auth", require("./routes/auth.route"));
app.use("/user", require("./routes/user.route"));
app.use("/comm", require("./routes/comm.route"));

module.exports = app;
