require("dotenv").config();
require("./models/connection");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var facturesRouter = require("./routes/factures");
var devisRouter = require("./routes/devis");
var clientsRouter = require("./routes/clients");
var excelRouter = require("./routes/excel");

var app = express();
const cors = require("cors");
app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/factures", facturesRouter);
app.use("/devis", devisRouter);
app.use("/clients", clientsRouter);
app.use("/excel", excelRouter);

module.exports = app;
