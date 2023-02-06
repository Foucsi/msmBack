var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");

const User = require("../models/users");
const Factures = require("../models/factures");
const Devis = require("../models/devis");

/* Post a new Devis avec clef etrangere */
router.post("/:token", async (req, res) => {
  const token = req.params.token;
  const { name, tel, email, adress } = req.body;
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
      user: data.username,
      name,
      tel,
      email,
      adress,
      createdAt: new Date(),
      numero: req.body.numero,
    });

    const saveDevis = await newDevis.save();
    res.json({ result: true, devis: saveDevis });
  } catch (err) {
    res.json({ result: false, message: err });
  }
});

/* get all devis */
router.get("/getAllDevis", async (req, res) => {
  try {
    const data = await Devis.find({});
    if (!data) {
      res.json({ result: false });
    }
    res.json({ result: true, devis: data });
  } catch (err) {
    res.json({ result: false, message: err });
  }
});

/*get allDevis byUsers */
// On recuperere tous les devis de l'utilisateur
router.get("/allDevis/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const data = await User.findOne({ token });
    if (!data) {
      res.json({ result: false, message: "user not found" });
    }
    const devis = await Devis.find({ author: data._id }).populate("author");
    res.json({ result: true, devis });
  } catch (err) {
    res.json({ result: false, message: err });
  }
});

/* recuperer la longueur du tableau de devis */
router.get("/getNumberArray", async (req, res) => {
  const data = await Devis.find({});
  if (!data) {
    res.json({ result: false });
  }
  const lengthArray = data.length;
  res.json({ result: true, lengthArray });
});

/* supprimer un tweet */
router.delete("/deleteDevis", async (req, res) => {
  const data = await User.findOne({ token: req.body.token });
  if (!data) {
    res.json({ result: false, message: "User not found!" });
  }
  const devis = await Devis.findById(req.body.devisId).populate("author");
  if (!devis) {
    res.json({ result: false, message: "Devis introuvable" });
  }
  const deleteDevis = await Devis.deleteOne({ _id: devis._id });
  if (deleteDevis) {
    res.json({ result: true });
  }
});

module.exports = router;
