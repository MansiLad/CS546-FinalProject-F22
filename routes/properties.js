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
  
  if(!req.session.user) return res.redirect('/userlogin')
  
  return res.render("renters",{title:'Search Properties'});
});

router.route("/property/:id").get(async (req, res) => {
  //code here for GET
  if(!req.session.user){
    return res.redirect('/userlogin')
  }
  let id = req.params.id;

  try{
    
    let prop = await propertiesData.getPropertyById()
  }catch(e){

  }
  return res.render("");
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
