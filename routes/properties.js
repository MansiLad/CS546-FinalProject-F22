const express = require("express");
const router = express.Router();
const data = require("../data");
const propertiesData = data.properties;
const usersData = data.users;
const filters = data.filters;
const path = require("path");
const xss = require('xss');
const { users } = require("../data");
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
  let userId = req.session.user;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zip = req.body.zip
  let bed = req.body.beds
  let bath = req.body.baths
  let deposit = req.body.deposit
  let rent = req.body.rent
  let amenities  = req.body.amenities
 // let desc = req.body.description

  try{
    let {insertedProp} = await propertiesData.createListing(
      address,city,state,zip, bed,bath,deposit,rent,amenities
    )
   // console.log(insertedProp)
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

router.route("/filters").get(async (req, res) => {
  try{
    const results = await propertiesData.getAllListings();
    console.log(results);
    res.render("afterSearch",{result: results});
  }catch(e)
  {
    console.log(e);
  }
  //res.render("filters/filter",{});
});

router.route("/filters").post(async (req, res) => {

  //console.log(req.body);
  // search_location= req.body.search_location;
  select_sortBy = req.body.select_sortBy;
  beds = req.body.beds
  baths = req.body.baths
  minimum = req.body.minimum
  maximum = req.body.maximum
  try{
    
    const result = await filters.getpropertyByFilterandSort(select_sortBy,beds,baths,minimum,maximum);
    //console.log(result);
    res.render("afterSearch",{result: result, minimum : minimum, maximum : maximum });

  }catch(e)
  {
    return res.render('error',{title:'Error',error:'Error'})
  }
  
});

router.route("/favourites").get(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.render("userLogin", { title: "Login Page" });
  }
  else{
    let emailId = req.session.user;
    let user_fav = await usersData.getUserByEmail(user);
    let fav = user_fav.favourites;
    results = []
    if(fav === 0){
      res.render("favourites",{error : "No properties added yet!"});
    }
    fav.forEach(async (propId) => {
      // console.log(propId);
      property = await propertiesData.getPropertyById(propId);
      // console.log(property);
      results.push(property);
    });
    console.log(results)
    results = JSON.parse(JSON.stringify(results))
  try{
    
    res.render("favourites",{results : results});
  }

  catch(e){
    console.log(e);
  }
  }
});

  router.route("/favourites").post(async (req, res) => {
    
    if (req.session.user) {
      // console.log(req.session);
      let emailId = req.session.user;
      let userInfo = await usersData.getUserByEmail(emailId);
      let userID = userInfo._id.toString();
      // console.log(userID);
      let favid = req.body.propertyId;
      favid = favid.toString();
      // console.log(favid);
      try {
        let addFavorite = await propertiesData.addToFavourite(userID, favid);
        if (addFavorite) {
          req.session.message = "Added to favourite successfully!";
          res.redirect("/filters");
        }
      } catch (e) {
        //console.log(e);
        req.session.error =
          "You have already added this property to your favourites!";
          res.redirect("/filters");
      }
    } else {
      
      req.session.message = "Please login first!";
      res.redirect("/user/userLogin");
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





router.route("/propertydetails/:id").get(async (req, res) => {
  if(isNaN(req.params.id)){
    return res.status(404).render('../views/error', {title: 'Invalid ID', Error: "Id should be a number"})
  }

//   const prop = await propertiesData.getPropertyByID(req.params.id)
//   if(prop === null || prop === undefined){
//     return res.status(404).render('../views/error', {title: 'Not found', Error: "No ID exist"})
//   }
//   res.render("../views/propertyDetails", {title:'Property', id:prop.id, address: prop.address, city: prop.city, state: prop.state, zipCode: prop.zipCode})
//   //add the rest 

});

router.route('/searchProperties')
.post(async(req,res) =>{
  let city = req.body.city
  let zip = req.body.zip
  let state = req.body.state
  try{
    if(!city && !zip && !state){
      throw 'No empty fields allowed!'
    }
    // let all_prop = [];
    // let all_prop = await propertiesData.getByState(city,state,zip);
    let all_prop = await filters.getByCityStateZip(city,state,zip);
    // let propState = await propertiesData.getByState(state);
    // let propZip = await propertiesData.getByZipcode(zip);
    all_prop = JSON.parse(JSON.stringify(all_prop))

//  console.log(all_prop)
    // console.log(propState)
    // console.log(propZip)

    return res.render('afterSearch',{id:all_prop._id,result: all_prop,title:'Houses'})

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



module.exports = router;
