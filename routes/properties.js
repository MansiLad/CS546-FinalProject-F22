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

router.route('/propertyRegistration').get(async(req,res) =>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  return res.render('propertyRegistration',{title:'Resgister your property here!'})
})

router.route("/propertyRegistration").post(async (req, res) => {
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

router.route('/manageRentals').get(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  return res.render('updateProp',{title:'Manage your properties'})
})

router.route('/manageRentals').post(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  // todo- mansi update/manage rentals code
})

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
  try{
    if(!city && !zip && !state){
      throw 'No empty fields allowed!'
    }
    let all_prop = await  propertiesData.getAllListings();
    return res.render('propertyDetails',{id:all_prop.UserId, address:all_prop.address,city:all_prop.city,state:all_prop.state,zipcode:all_prop.zipcode,rent:all_prop.rent,deposit:all_prop.deposit,amenities:all_prop.amenities,reviews:all_prop.reviews,date:all_prop.date,images:all_prop.images})



  }catch(e){
    return res.render('error', {error:e, title:'Error'})
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
