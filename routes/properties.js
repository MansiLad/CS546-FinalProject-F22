const express = require("express");
const router = express.Router();
const data = require("../data");
const propertiesData = data.properties;
const reviewsData= data.reviews;
const path = require("path");
// const userData = data.users;

router.route("/").get(async (req, res) => {
  //code here for GET
  //if(!req.session.user) return res.redirect('/userlogin');
  res.sendFile(path.resolve("static/homepage.html"));
});

router.route("/propUpload").post(async (req, res) => {
  if(!req.session.user) return res.redirect('/userlogin')
  //code here for post
  console.log(req.body.filename);
});

router.route("/searchProperties").get(async (req, res) => {
  //code here for GET
  try {
    let prop = await propertiesData.getAllListings();
    res.render('name of tempelate', {prop: prop})
  } catch (error) {
    return res.render('error', {error: error})
  }
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
    await propertiesData.removeListing(id);
    res.redirect('/properties')
  } catch (error) {
    return res.render('error', {error: error})
  }
  
});

module.exports = router;
