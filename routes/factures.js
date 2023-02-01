var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");

const User = require("../models/users");
const Factures = require("../models/factures");
const Devis = require("../models/devis");

module.exports = router;
