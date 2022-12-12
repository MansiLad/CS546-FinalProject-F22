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
