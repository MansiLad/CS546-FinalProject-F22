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
  //let prop_det = req.body.
  try {
    let prop = await propertiesData.getAllListings();
    res.render('searchProp', {title:'Get your favourite properties!'})
  } catch (error) {
    return res.render('error', {error: error})
  }
  //return res.render("renters");
});

router.route("/propertydetails/:id").get(async (req, res) => {
  if(isNaN(req.params.id)){
    return res.status(404).render('../views/error', {title: 'Invalid ID', Error: "Id should be a number"})
  }

  const prop = await propertiesData.getPropertyByID(req.params.id)
  if(prop === null || prop === undefined){
    return res.status(404).render('../views/error', {title: 'Not found', Error: "No ID exist"})
  }
  res.render("../views/propertybyID", {title:'Property', id:prop.id, address: prop.address, city: prop.city, state: prop.state, zipCode: prop.zipCode})
  //add the rest 

});

router.route('/searchProperties').post(async(req,res) =>{
  let city = req.body.city
  let zip = req.body.zipcode
  let state = req.body.state
  if(!city && !zip && !state){
    res.render('error',{title:'Error', error: `The inputs cannot be empty`})
  }
  
})

router.route('/propdetails/:id').get(async(req,res) =>{

})

router.route("/filtered").get(async (req, res) => {
  //code here for post
  // function for filter
  try {
    let search = req.body.search

  } catch (error) {
    return res.render('error',  {error:error})
  }
  return res.render("Name of the template");
});

router.route("/removelisting").delete(async (req, res) => {
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
