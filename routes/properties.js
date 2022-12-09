const express = require("express");
const router = express.Router();
const data = require("/data");
const propertiesData = data.properties;
const path = require("path");
// const userData = data.users;

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve("static/property_homepage.html"));
});

router.route("/propUpload").post(async (req, res) => {
  //code here for post
  console.log(req.body.filename);
});

router.route("/properties").get(async (req, res) => {
  //code here for GET
  return res.render("Name of the template");
});

router.route("/filtered").post(async (req, res) => {
  //code here for post
  // function for filter
  return res.render("Name of the template");
});

router.route("/removelisting").post(async (req, res) => {
  //code here for post
  id = req.params.id;
  id = helper.chekId(id);
  try {
    propertiesData.removeListing(id);
  } catch (error) {
    
  }
  
});

module.exports = router;
