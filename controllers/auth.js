require("dotenv").config();
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  let { email, password } = req.query;
  email = req.query.email.toLowerCase();
  const user = await User.findOne({ "contactDetails.email": email });
  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      try {
        const token = jwt.sign(
          JSON.stringify(user),
          process.env.ACCESS_TOKEN_SECRET
        );
        res.send({ msg: "Logged In Successfully!", token: token, user });
      } catch (error) {
        console.log(error);
        res.status(500).send({ msg: "Authentication Failed" });
      }
    } else {
      res.status(401).send({ msg: "Incorrect Credentials!" });
    }
  } else {
    res.status(404).send({ msg: "User Not Found" });
  }
};

const signUp = async (req, res) => {
  req.body.contactDetails.email = req.body?.contactDetails?.email.toLowerCase();
  const query = { "contactDetails.email": req.body?.contactDetails?.email };

  const user = await User.findOne(query);
  if (user) {
    try {
      res.status(409).send({ msg: "User Exists Please Login!" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .send({ msg: "Error Fetching User Details, Try Again Later" });
    }
  } else {
    await hashPassword(req, res).then(() => {
      User.create(req.body).then((user) => {
        if (user) {
          res
            .status(200)
            .send({ msg: "Registered Successfully", user: user[0] });
        } else {
          res
            .status(500)
            .send({ msg: "Error Creating User Details, Try Again Later" });
        }
      });
    });
  }
};

const hashPassword = async (req, res) => {
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    return;
  } catch (error) {
    console.log(error);
    res.send({ msg: "Error hashing password" }).sendStatus(500);
  }
};

const fetchReferrer = async (req, res) => {
  await User.find(req.query, {
    "personalDetails.name": 1,
    "personalDetails.surname": 1,
    contactDetails: 1,
  }).then((user) => {
    try {
      if (user.length > 0) {
        res.send(user);
      } else {
        res.send({ err: "Referrer does not exist" });
      }
    } catch (error) {
      res.send({ err: "Error fetching referrer details" });
    }
  });
};

router.post("/register", signUp);
router.get("/login", login);
router.get("/fetchReferrer", fetchReferrer);
module.exports = router;
