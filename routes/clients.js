var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");

const Clients = require("../models/clients");

router.post("/", async (req, res) => {
  const { name, tel, email, adress } = req.body;
  if (!checkBody(req.body, ["name"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }
  const existingClients = await Clients.findOne({ name });
  if (existingClients) {
    res.jons({ result: false, error: "Clients deja existant!" });
  }

  const newClients = new Clients({
    name,
    tel,
    email,
    adress,
  });

  const saveNewClient = await newClients.save();
  res.json({ result: true, client: saveNewClient });
});

module.exports = router;
