var express = require("express");
var router = express.Router();
require("../models/connection");
const { checkBody } = require("../modules/checkBody");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");

const User = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

/* get Profil by Token */
router.get("/getProfilByToken/:token", async (req, res) => {
  const token = req.params.token;
  try {
    const data = await User.findOne({ token });

    if (!data) {
      res.json({ result: false, message: "User not found!" });
    }
    res.json({ result: true, profil: data.profil });
  } catch (err) {
    res.json({ result: false, message: err });
  }
});

/* route signup */
router.post("/signup", async (req, res) => {
  // Extract the required fields from the request body
  const { username, email, password, profil } = req.body;
  // Check if the required fields are present and not empty
  if (!checkBody(req.body, ["username", "password"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }
  // Check if a user with the same username already exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.json({ result: false, error: "User already exists" });
  }
  // Hash the password
  const hash = bcrypt.hashSync(password, 10);
  // Create a new user object
  const newUser = new User({
    username,
    email,
    password: hash,
    token: uid2(32),
    profil,
    factures: [],
    devis: [],
  });
  // Save the new user to the database
  const savedUser = await newUser.save();
  // Return a success response with the saved user data
  res.json({ result: true, user: savedUser });
});

/* route signin */
router.post("/signin", async (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  try {
    const data = await User.findOne({ username: req.body.username });
    if (data && (await bcrypt.compare(req.body.password, data.password))) {
      res.json({ result: true, user: data });
    } else {
      res.json({ result: false, error: "User not found or wrong password" });
    }
  } catch (err) {
    res.json({ result: false, error: err });
  }
});

module.exports = router;
