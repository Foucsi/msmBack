var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");

const User = require("../models/users");
const Factures = require("../models/factures");
const Devis = require("../models/devis");

router.post("/:token", async (req, res) => {
  const token = req.params.token;
  if (!checkBody(req.body, ["name"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  try {
    const data = await User.findOne({ token });

    if (!data) {
      res.json({ result: false, message: "User not found!" });
    }
    const newDevis = new Devis({
      author: data._id,
      name: req.body.name,
      tel: req.body.tel,
      email: req.body.email,
      adress: req.body.adress,
      createdAt: new Date(),
      numero: req.body.numero,
    });

    const saveDevis = await newDevis.save();
    res.json({ result: true, devis: saveDevis });
  } catch (err) {
    res.json({ result: false, message: err });
  }
});

module.exports = router;
