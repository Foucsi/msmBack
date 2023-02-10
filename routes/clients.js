var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");

const Clients = require("../models/clients");
const User = require("../models/users");

/* recuperer la liste des clients */
router.get("/all", async (req, res) => {
  const data = await Clients.find({});

  if (!data) {
    res.json({ result: false, message: "Pas de clients enregistré!" });
  }
  res.json({ result: true, data });
});

/* get all devis */
router.get("/getAllDevis", async (req, res) => {
  try {
    const data = await Clients.find({});
    if (!data) {
      res.json({ result: false });
    }
    res.json({ result: true, devis: data });
  } catch (err) {
    res.json({ result: false, message: err });
  }
});

/* recuperer info client byId */
// router.get("/:id", async (req, res) => {
//   try {
//     const client = await Clients.findOne({ _id: req.params.id });
//     if (!client) {
//       return res.status(404).json({ message: "Client not found" });
//     }
//     res.json({ result: true, client });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

/* recuperer les info client par son nom */
router.get("/:name", async (req, res) => {
  const name = req.params.name;
  const client = await Clients.findOne({ name });
  if (client) {
    res.json({ result: true, client });
  }
});

/* route permettant d'enregistrer un client en db */
router.post("/:token", async (req, res) => {
  const token = req.params.token;
  const { name, tel, email, adress, user } = req.body;
  if (!checkBody(req.body, ["name"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }
  try {
    const existingClients = await User.findOne({ token });
    if (!existingClients) {
      return res.json({ result: false, error: "Clients deja existant!" });
    }
    const newClients = new Clients({
      author: existingClients._id,
      user,
      name,
      tel,
      email,
      adress,
      createdAt: new Date(),
      devis: [],
      facture: [],
    });

    const saveNewClient = await newClients.save();
    res.json({ result: true, client: saveNewClient });
  } catch (err) {
    res.json({ result: false, error: err });
  }
});

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

    const devis = await Clients.findById(req.body.devisId).populate("author");
    //Essaye de trouver un document "devis" avec l'ID spécifié dans le corps de la requête
    //et peuple le champ "author".
    // La méthode findById renvoie un seul document correspondant à l'ID spécifié.
    // La méthode populate remplit un champ associé avec des données complètes plutôt qu'un simple ID de référence.
    if (!devis) {
      //Si aucun devis n'a été trouvé, renvoie une réponse JSON avec "result: false" et "message: 'Devis introuvable'"
      res.json({ result: false, message: "Devis introuvable" });
    } else if (
      String(devis.author._id) !== String(data._id) &&
      String(data.profil) !== "administrateur"
      // dans ce code seul l'admin Aly a la possiblité de supprimer les devis de tous le monde
    ) {
      //Si l'auteur du devis n'est pas le même que l'utilisateur trouvé à l'étape 2,
      //renvoie une réponse JSON avec "result: false" et "error: 'Vous n'etes pas autorisé a effectuer cette action'"
      res.json({
        result: false,
        error: "Vous n'etes pas autorisé a effectuer cette action",
      });
      return;
    }
    const deleteDevis = await Clients.deleteOne({ _id: devis._id });
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

/* route permettant de pouvoir modifier */
router.put("/updateProfil", async (req, res) => {
  const name = req.body.name;
  const newName = req.body.newName;
  try {
    const client = await Clients.findOneAndUpdate({ name }, { name: newName });
    if (!client) {
      res.json({ result: false, error: "client not found!" });
    }
    res.json({ result: true, client });
  } catch (err) {
    res.json({ result: false, error: err });
  }
});

module.exports = router;
