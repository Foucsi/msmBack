var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");

const Clients = require("../models/clients");

/* recuperer la liste des clients */
router.get("/all", async (req, res) => {
  const data = await Clients.find({});

  if (!data) {
    res.json({ result: false, message: "Pas de clients enregistré!" });
  }
  res.json({ result: true, data });
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
router.post("/", async (req, res) => {
  const { name, tel, email, adress } = req.body;
  if (!checkBody(req.body, ["name"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }
  try {
    const existingClients = await Clients.findOne({ name });
    if (existingClients) {
      return res.json({ result: false, error: "Clients deja existant!" });
    }
    const newClients = new Clients({
      name,
      tel,
      email,
      adress,
    });

    const saveNewClient = await newClients.save();
    res.json({ result: true, client: saveNewClient });
  } catch (err) {
    res.json({ result: false, error: err });
  }
});

module.exports = router;
