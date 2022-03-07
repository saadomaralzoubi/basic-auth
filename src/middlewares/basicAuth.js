"use strict";

const base64 = require("base-64");
const bcrypt = require("bcrypt");

const { Users } = require("../models/index");

const basicAuth = async (req, res, next) => {
  if (req.headers.authorization) {
    let basicHeeaderParts = req.headers.authorization.split(" ");
    let encoded = basicHeeaderParts.pop();
    let decoded = base64.decode(encoded);
    let [username, password] = decoded.split(":");
    try {
      const User = await Users.findOne({ where: { username: username } });
      const valid = await bcrypt.compare(password, User.password);
      if (valid) {
        req.value = User.username;
        next();
      } else {
        next("invalid password");
      }
    } catch {
      res.status(500).send("invalid username");
    }
  }
};
module.exports = basicAuth;
