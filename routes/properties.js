const express = require("express");
const router = express.Router();
const data = require("../data");
const propertiesData = data.properties;
const reviewsData = data.reviews;
const filters = data.filters;
const path = require("path");
const xss = require('xss');
// const userData = data.users;

router.route("/")
.get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve("static/homepage.html"));
});

router.route('/propertyRegistration')
.get(async(req,res) =>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  return res.render('propertyAdd',{title:'Register your property here!'})
})
.post(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  //code here for post
  //check this once
  let userId = req.session.user;
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zip = req.body.zipcode
  let bed = req.body.beds
  let bath = req.body.baths
  let deposit = req.body.deposit
  let rent = req.body.rent
  let ammenities  = req.body.ammenities
  // let desc = req.body.description

  try{
    let {insertedProp} = await propertiesData.createListing(
      userId,address,city,state,zip, bed,bath,deposit,rent,ammenities
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
  try {
    let prop = await propertiesData.getPropertybyOwner(req.session.user);
    console.log(prop)
    res.render('manageProperties', {title:'Properties owned by you', OwnerName: req.session.user, result: prop})
  } catch (error) {
    return res.status(404).render('error', {error: error})
  }
}); 

router.route('/editProperty/:id')
.get(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  try{
    id = validation.checkId(req.params.id)

    const prop = await propertiesData.getPropertyById(id)

    return res.render('propertyEdit', {title: "Edit Property", property: prop})
  }catch(error){
    return res.status(404).render('error', {error: error})
  }
})
.post(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  try {
    id = validation.checkId(req.params.id)
    let updatedData = req.body
    const updatedProp = await propertiesData.updateListing(
      updatedData.propertyId, updatedData.address, updatedData.city,
      updatedData.state, updatedData.zipcode, updatedData.beds, updatedData.baths,
      updatedData.deposit, updatedData.rent, updatedData.ammenities, updatedData.available
    )
    return res.redirect("/manageRentals");
  }catch(error){
    console.log(error)
    return res.render('error', {error: error})
  }
});

router.route('/deleteProperty/:id')
.get(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  try{
    let deleted = await propertiesData.removeListing(req.params.id)
    return res.redirect("/manageRentals")
  } catch(error) {
    return res.render('error', {error: error})
  }
});

/* router.route("/ownedProperties")
.get(async (req, res) => {
  //code here for GET
  //let prop_det = req.body.
  try {
    let prop = await propertiesData.getPropOwnerbyId(req.params.id);
    res.render('allProperties', {title:'Properties owned by you',OwnerName: req.params.id, result: prop})
  } catch (error) {
    return res.render('error', {error: error})
  }
}); */


router.route("/searchProperties")
.get(async (req, res) => {
  try {
    res.render('searchProp', {title:'Get your favourite properties!'})
  } catch (error) {
    return res.render('error', {error: error})
  }
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





// router.route("/propertydetails/:id").get(async (req, res) => {
//   if(isNaN(req.params.id)){
//     return res.status(404).render('../views/error', {title: 'Invalid ID', Error: "Id should be a number"})
//   }


//   const prop = await propertiesData.getPropertyByID(req.params.id)
//   if(prop === null || prop === undefined){
//     return res.status(404).render('../views/error', {title: 'Not found', Error: "No ID exist"})
//   }
//   res.render("../views/propertyDetails", {title:'Property', id:prop.id, address: prop.address, city: prop.city, state: prop.state, zipCode: prop.zipCode})
//   //add the rest 


router.route('/removelisting').delete(async (req, res) => {
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

router.route('/searchProperties').post(async(req,res) =>{
  let city = req.body.city
  let zip = req.body.zip
  let state = req.body.state
  let id = [];
  try{
    if(!city && !zip && !state){
      throw 'No empty fields allowed!'
    }
    let all_prop = await filters.getByCityStateZip(city,state,zip);
    // let propState = await propertiesData.getByState(state);
    // let propZip = await propertiesData.getByZipcode(zip);
    all_prop = JSON.parse(JSON.stringify(all_prop))

   console.log(all_prop)
    // console.log(propState)
    // console.log(propZip)

    return res.render('afterSearch',{id:id,result: all_prop,title:'Houses'})



  }catch(e){
    return res.render('error', {error:e, title:'Error'})
  }
  
})

router.route('/propdetails/:id').get(async(req,res) =>{
let p_id = req.params.id
p_id = p_id.trim();
try{
  let each_prop_detail = await data_people.searchPeopleByID(p_id)

}catch(e){
return res.render('error',{title:'Error Page',error:'No property!'})
}

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
