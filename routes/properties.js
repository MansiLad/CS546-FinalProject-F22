const express = require("express");
const router = express.Router();
const data = require("../data");
const propertiesData = data.properties;
const filters = data.filters;
const path = require("path");
const xss = require('xss');
// const userData = data.users;

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve("static/homepage.html"));
});

router.route('/propertyRegistration')
.get(async(req,res) =>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  return res.render('propertyRegistration',{title:'Register your property here!'})
})
.post(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  //code here for post
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zip = req.body.zip
  let bed = req.body.beds
  let bath = req.body.baths
  let deposit = req.body.deposit
  let rent = req.body.rent
  let amenities  = req.body.amenities
  let desc = req.body.description

  try{
    let {insertedProp} = await propertiesData.createListing(
      address,city,state,zip, bed,bath,deposit,rent,amenities,desc
    )
    if(insertedProp){
      return res.redirect('/manageRentals')
    }
  }catch(e){
    return res.render('error',{title:'Error',error:'Search Again!'})
  }
});

router.route('/manageRentals')
.get(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  return res.render('manageProperties',{title:'Manage your properties'})
});
router.route('/propertydetails/edit/:id')
.post(async(req, res)=>{
  //TO DO: input the 4 vales from the from that are changed
});

router.route("/searchProperties")
.get(async (req, res) => {
  //code here for GET
  //let prop_det = req.body.
  try {
    //let prop = await propertiesData.getAllListings();
    res.render('searchProp', {title:'Get your favourite properties!'})
  } catch (error) {
    return res.render('error', {error: error})
  }
  //return res.render("renters");
});

router.route("/filters")
.get(async (req, res) => {
  try{
    const results = await filters.getAllproperties();
    //console.log(results);
    res.render("renters",{results});
  }catch(e)
  {
    console.log(e);
  }
})
.post(async (req, res) => {
  console.log(req.body);
  // search_location= req.body.search_location;
  select_sortBy = req.body.select_sortBy;
  beds = req.body.beds
  baths = req.body.baths
  minimum = req.body.minimum
  maximum = req.body.maximum
  try{
    
    const results = await filters.getpropertyByFilterandSort(select_sortBy,beds,baths,minimum,maximum);
    console.log(results);
    res.render("renters",{results: results, minimum : minimum, maximum : maximum });
  }catch(e)
  {
    return res.render('error',{title:'Error',error:'Error'})
  }
  
});


router.route("/ownedProperties")
.get(async (req, res) => {
  //code here for GET
  //let prop_det = req.body.
  try {
    let prop = await propertiesData.getPropOwnerbyId(req.params.id);
    res.render('allProperties', {title:'Properties owned by you',OwnerName: req.params.id, result: prop})
  } catch (error) {
    return res.render('error', {error: error})
  }
});


router.route("/propertydetails/:id")
.get(async (req, res) => {
  if(isNaN(req.params.id)){
    return res.status(404).render('../views/error', {title: 'Invalid ID', Error: "Id should be a number"})
  }

  const prop = await propertiesData.getPropertyByID(req.params.id)
  if(prop === null || prop === undefined){
    return res.status(404).render('../views/error', {title: 'Not found', Error: "No ID exist"})
  }
  res.render("../views/propertyDetails", {title:'Property', id:prop.id, address: prop.address, city: prop.city, state: prop.state, zipCode: prop.zipCode})
  //add the rest 

})
.delete(async (req, res) => {
  //code here for post
  id = req.params.id;
  id = helper.chekId(id);
  try {
    await propertiesData.removeListing(id);
    res.redirect('/manageProperties')
  } catch (error) {
    return res.render('error', {error: error})
  }
});

router.route('/searchProperties')
.post(async(req,res) =>{
  let city = req.body.city
  let zip = req.body.zipcode
  let state = req.body.state
  try{
    if(!city && !zip && !state){
      throw 'No empty fields allowed!'
    }
    let all_prop = [];
    let propCity = await propertiesData.getByCity(city);
    let propState = await propertiesData.getByState(state);
    let propZip = await propertiesData.getByZipcode(zip);
    all_prop = [...propCity,...propState,...propZip]
    return res.render('propertyDetails',{id:all_prop.UserId, address:all_prop.address,city:all_prop.city,state:all_prop.state,zipcode:all_prop.zipcode,rent:all_prop.rent,deposit:all_prop.deposit,amenities:all_prop.amenities,reviews:all_prop.reviews,date:all_prop.date,images:all_prop.images})

  }catch(e){
    return res.render('error', {error:e, title:'Error'})
  }
  
})

router.route("/filtered")
.get(async (req, res) => {
  //code here for post
  // function for filter
  try {
    let search = req.body.search

  } catch (error) {
    return res.render('error',  {error:error})
  }
  return res.render("Name of the template");
});



module.exports = router;
