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

/* route signup */
router.post("/signup", async (req, res) => {
  // Extract the required fields from the request body
  const { username, email, password } = req.body;
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

module.exports = router;
