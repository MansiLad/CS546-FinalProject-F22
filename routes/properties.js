const express = require("express");
const router = express.Router();
const data = require("../data");
const propertiesData = data.properties;
const reviewsData = data.reviews;
const filters = data.filters;
const path = require("path");
const nodemailer = require('nodemailer');

// const userData = data.users;

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve("static/homepage.html"));
});

router.route('/propertyRegistration').get(async(req,res) =>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  return res.render('propertyRegistration',{title:'Resgister your property here!'})
})

router.route("/propertyRegistration").post(async (req, res) => {
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

router.route('/manageRentals').get(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  return res.render('allProperties',{title:'Manage your properties'})
})

router.route('/manageRentals').post(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  // todo- mansi update/manage rentals code
})

router.route("/searchProperties").get(async (req, res) => {
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


router.route("/filters").post(async (req, res) => {
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


router.route("/ownedProperties").get(async (req, res) => {
  //code here for GET
  //let prop_det = req.body.
  try {
    let prop = await propertiesData.getPropOwnerbyId(req.params.id);
    res.render('allProperties', {title:'Properties owned by you',OwnerName: req.params.id, result: prop})
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
   all_prop.forEach(props => {
    id.push(props._id);
   });
    //console.log(id);
      return res.render('afterSearch',{id:id,result: all_prop,title:'Houses'})
  }catch(e){
    return res.render('error', {error:e, title:'Error'})
  }
})

router.route('/propdetails/:id').get(async(req,res) =>{
let p_id = req.params.id
p_id = p_id.trim();
//console.log(p_id)
try{
  let each_prop_detail = await propertiesData.getPropertyById(p_id)
  //console.log(each_prop_detail)
  if(!each_prop_detail){
    return res.render('error',{title:'Error Page',error:'No properties!'})
  }
  let add = each_prop_detail.address;
  return res.render('propertyDetails',{id:each_prop_detail._id,address:add,city:each_prop_detail.city,state:each_prop_detail.state,zipcode:each_prop_detail.zipCode,rent:each_prop_detail.rent,deposit:each_prop_detail.deposit,bed:each_prop_detail.beds,bath:each_prop_detail.baths,amenities:each_prop_detail.ammenities})

}catch(e){
return res.render('error',{title:'Error Page',error:'No property!'})
}
})

router.route('/prop/reviews/?propId=id').get(async(req,res)=>{
  let p_id = req.query.propId
  console.log(p_id)
p_id = p_id.trim();
let reviews = await reviewsData.getAllReviews(p_id)
  return res.render('reviewsPage',{title:'Get the reviews of your favourite property',result:reviews})
})

router.route('/prop/reviews?propId=id').post(async(req,res)=>{
  let review_property = req.body;
  let p_id = req.params.id
  let prop_rev = await reviewsData.createReview(p_id,review_property);
  return res.render('partials/rev',{layout:null,...prop_rev})
})

router.route('/contact').get(async(req,res)=>{
return res.render('contact',{title:'Contact Page', msg:'Provide your details, Owner will contact you'})
})

router.route('/contact').post(async(req,res)=>{
  
})

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
