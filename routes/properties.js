const express = require("express");
const router = express.Router();
const data = require("../data");
const propertiesData = data.properties;
const path = require("path");
// const userData = data.users;

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve("static/property_homepage.html"));
});