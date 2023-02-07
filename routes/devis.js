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
  //Démarre une bloc try/catch pour capturer les erreurs potentielles.
  try {
    const data = await User.findOne({ token: req.body.token });
    //Essaye de trouver un utilisateur avec le token spécifié dans le corps de la requête.
    //La méthode findOne renvoie un seul document correspondant aux critères spécifiés.
    if (!data) {
      //Si aucun utilisateur n'a été trouvé, renvoie une réponse JSON avec "result: false" et "message: 'User not found!'"
      res.json({ result: false, message: "User not found!" });
    }

    const devis = await Devis.findById(req.body.devisId).populate("author");
    //Essaye de trouver un document "devis" avec l'ID spécifié dans le corps de la requête
    //et peuple le champ "author".
    // La méthode findById renvoie un seul document correspondant à l'ID spécifié.
    // La méthode populate remplit un champ associé avec des données complètes plutôt qu'un simple ID de référence.
    if (!devis) {
      //Si aucun devis n'a été trouvé, renvoie une réponse JSON avec "result: false" et "message: 'Devis introuvable'"
      res.json({ result: false, message: "Devis introuvable" });
    } else if (String(devis.author._id) !== String(data._id)) {
      //Si l'auteur du devis n'est pas le même que l'utilisateur trouvé à l'étape 2,
      //renvoie une réponse JSON avec "result: false" et "error: 'Vous n'etes pas autorisé a effectuer cette action'"
      res.json({
        result: false,
        error: "Vous n'etes pas autorisé a effectuer cette action",
      });
      return;
    }
    const deleteDevis = await Devis.deleteOne({ _id: devis._id });
    // Essaye de supprimer le document "devis" trouvé à l'étape 4.
    //La méthode deleteOne supprime le premier document trouvé correspondant aux critères spécifiés.
    if (deleteDevis) {
      //Si la suppression du devis a réussi, renvoie une réponse JSON avec "result: true".
      res.json({ result: true });
    }
  } catch (err) {
    //Si une erreur est survenue dans le bloc try, la capture dans la variable "err".
    res.json({ result: false, message: err });
  }
});

module.exports = router;
