const express = require("express");
const router = express.Router();
const data = require("../data");
const propertiesData = data.properties;
const reviewsData = data.reviews;
const filters = data.filters;
const path = require("path");
const multer = require("multer");
require("dotenv").config();
const app = express();
const { s3Uploadv2 } = require("../s3Service");
const { ObjectId } = require("mongodb");
const { properties } = require("../config/mongoCollections");
const validation = require('../helpers')
const nodemailer = require('nodemailer')
const xss = require('xss');
const { users } = require("../data");
const usersData = data.users

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split("/")[0] === "image") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100000000000, files: 10 },
});

router.route("/").get(async (req, res) => {
  //code here for GET
  res.sendFile(path.resolve("static/homepage.html"));
});

router.route("/propertyRegistration")
.get(async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userlogin");
  return res.render("propertyAdd", {
    title: "Resgister your property here!",
  });
})
.post(async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userlogin");
  
  let suser = req.session.user;

  let propinfo = req.body;



  //.render("error", 

  if(!propinfo) {
    res.status(400).render("error", {error: "Provide data to create property"})
    throw "Data not provided to create property"
  }
    
  let address = xss(propinfo.address);
  if(!address) {
    res.status(400).render("error", {error: "Provide address of property"})
    throw "Address not provided"
  }
  if(typeof address != 'string'){
    res.status(400).render("error",{error: 'Address should be a string'})
    throw 'Address should be a string'
  }
  if(address.trim().length === 0){
    res.status(400).render("error",{error: 'Provide address of property'})
    throw 'Address cannot be empty string or spaces'
  }
  address = address.trim()
  if(address.length < 4){
    res.status(400).render("error",{error: 'Address should be atleast 4 characters long'})
    throw 'Address should be of length 4 or more'
  }


  let city = xss(propinfo.city);
  if(!city) {
    res.status(400).render("error",{error: "Provide city of property"})
    throw "City not provided"
  }
  if(typeof city != 'string'){
    res.status(400).render("error",{error: 'City should be a string'})
    throw 'City should be a string'
  }
  if(city.trim().length === 0){
    res.status(400).render("error",{error: 'Provide city of property'})
    throw 'City cannot be empty string or spaces'
  }
  city = city.trim()
  if(city.length < 3){
    res.status(400).render("error",{error: 'City should be atleast 3 characters long'})
    throw 'City should be of length 3 or more'
  }
  if(!/^[A-Za-z\s.,-]+$/.test(city)){
    res.status(400).render("error",{error: 'City should be only string'})
    throw 'City should be only string'
  }


  let state = xss(propinfo.state);
  if(!state) {
    res.status(400).render("error",{error: "Provide state of property"})
    throw "State not provided"
  }
  if(typeof state != 'string'){
    res.status(400).render("error",{error: 'State should be a string'})
    throw 'State should be a string'
  }
  if(state.trim().length === 0){
    res.status(400).render("error",{error: 'Provide state of property'})
    throw 'State cannot be empty string or spaces'
  }
  state = state.trim()
  if(state.length < 3){
    res.status(400).render("error",{error: 'State should be atleast 3 characters long'})
    throw 'State should be of length 3 or more'
  }
  if(!/^[A-Za-z\s.,-]+$/.test(state)){
    res.status(400).render("error",{error: 'State should be only string'})
    throw 'State should be only string'
  }


  let zip = xss(propinfo.zipcode);
  if(!zip) {
    res.status(400).render("error",{error: "Provide zip code of property"})
    throw "Zip Code not provided"
  }
  if(zip.trim().length === 0){
    res.status(400).render("error",{error: 'Provide zip of property'})
    throw 'Zip Code cannot be empty string or spaces'
  }
  zip = zip.trim()
  if(zip.length < 3){
    res.status(400).render("error",{error: 'Zip Code should be atleast 3 characters long'})
    throw 'Zip Code should be of length 3 or more'
  }
  if(!/^\d{5}(-\d{4})?$/.test(zip)){
    res.status(400).render("error",{error: 'Zip Code should be valid'})
    throw 'Zip Code should be valid'
  }


  let bed = xss(propinfo.beds);
  if(!bed) {
    res.status(400).render("error",{error: "Provide no. of bed"})
    throw "Number of beds not provided"
  }
  if(bed.trim().length === 0){
    res.status(400).render("error",{error: 'Provide no of bed'})
    throw 'number of bed cannot be empty string or spaces'
  }
  bed = bed.trim()
  if(!/^[0-9]+$/.test(bed)){
    res.status(400).render("error",{error: 'Bed should be a number'})
    throw 'Number of beds should be a number'
  }


  let bath = xss(propinfo.baths);
  if(!bath) {
    res.status(400).render("error",{error: "Provide number of bath"})
    throw "Number of bath not provided"
  }
  if(bath.trim().length === 0){
    res.status(400).render("error",{error: 'Provide number of bath'})
    throw 'Number of bath cannot be empty string or spaces'
  }
  bath = bath.trim()
  if(!/^[0-9]+$/.test(bath)){
    res.status(400).render("error",{error: 'Number of bathrooms should be a number'})
    throw 'Number of bathrooms should be a number'
  }


  let deposit = xss(propinfo.deposit);
  if(!deposit) {
    res.status(400).render("error",{error: "Provide deposit of property"})
    throw "Deposit not provided"
  }

  if(!/^[0-9]+$/.test(deposit)){
    res.status(400).render("error",{error: 'Deposit should be a number'})
    throw 'Deposit should be a number'
  }
  if(deposit.trim().length === 0){
    res.status(400).render("error",{error: 'Provide deposit of property'})
    throw 'Deposit cannot be empty string or spaces'
  }
  deposit = deposit.trim()

  let rent = xss(propinfo.rent);
  if(!rent) {
    res.status(400).render("error",{error: "Provide rent of property"})
    throw "Rent not provided"
  }
  if(!/^[0-9]+$/.test(rent)){
    res.status(400).render("error",{error: 'Rent should be a number'})
    throw 'Rent should be a number'
  }
  if(rent.trim().length === 0){
    res.status(400).render("error",{error: 'Provide rent of property'})
    throw 'Rent cannot be empty string or spaces'
  }
  rent = rent.trim()


  let ammenities = xss(propinfo.ammenities);
  if(!ammenities) {
    res.status(400).render("error",{error: "Provide ammenities of property"})
    throw "Ammenities not provided"
  }
  if(typeof ammenities != 'string'){
    res.status(400).render("error",{error: 'Ammenities should be a string'})
    throw 'Ammenities should be a string'
  }
  if(ammenities.trim().length === 0){
    res.status(400).render("error",{error: 'Provide ammenities of property'})
    throw 'Ammenities cannot be empty string or spaces'
  }
  ammenities = ammenities.trim()
  if(ammenities.length < 4){
    res.status(400).render("error",{error: 'Ammenities should be atleast 4 characters long'})
    throw 'Ammenities should be of length 4 or more'
  }


  let desc = xss(propinfo.description);
  if(!desc) {
    res.status(400).render("error",{error: "Provide description of property"})
    throw "Description of property not provided"
  }
  if(typeof desc != 'string'){
    res.status(400).render("error",{error: 'Description of property should be a string'})
    throw 'Description of property should be a string'
  }
  if(desc.trim().length === 0){
    res.status(400).render("error",{error: 'Provide description of property'})
    throw 'Description of property cannot be empty string or spaces'
  }
  desc = desc.trim()
  if(desc.length < 4){
    res.status(400).render("error", {error: 'Description of property should be atleast 4 characters long'})
    throw 'Description of property should be of length 4 or more'
  }

  try {
    let insertedProp = await propertiesData.createListing(
      suser,
      address,
      city,
      state,
      zip,
      bed,
      bath,
      deposit,
      rent,
      ammenities,
      desc,
    );
    if (insertedProp) {
      return res.redirect("/imageupload/" + ObjectId(insertedProp));
    }
  } catch (e) {
    console.log(e);
    return res.render("error", { title: "Error", error: "Enter Again!" });
  }
});

router.route("/imageupload/:id")
.get(async (req, res) => {
  let id = req.params.id
  validation.checkId(id)
  return res.render("imageupload", { title: "Upload", id: id });
  // return res.sendFile(path.resolve("static/upload.html"));
});

router.route('/manageRentals')
.get(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userlogin')
  try {
    let prop = await propertiesData.getPropertybyOwner(req.session.user);
    if(!prop)   throw 'No property owned by you'
    res.render('manageProperties', {title:'Properties owned by you', result: prop})
  } catch (error) {
    return res.status(404).render("error", { error: error });
  }
});


//TO BE CHECK - DOESNOT SEEM TO WORK AS EXPECTED
router.route('/editProperty/:id')
.get(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  try{
    let id = req.params.id
    validation.checkId(id)
    const prop = await propertiesData.getPropertyById(id)
    if(!prop) throw 'No property with this id'
    return res.render('propertyEdit', {title: "Edit Property", property: prop})
  }catch(error){
    return res.status(404).render('error', {error: error})
  }
})
.post(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  try {
    let id = req.params.id
    validation.checkId(id)
    let updatedData = req.body
    
    if(!updatedData) {
      res.status(400).render("error",{error: "Provide data to update property"})
      throw "Data not provided to update property"
    }

    let deposit = xss(updatedData.deposit)
    if(!deposit) {
      res.status(400).render("error",{error: "Provide deposit of property"})
      throw "Deposit not provided"
    }
    if(!/^[0-9]+$/.test(deposit)){
      res.status(400).render("error",{error: 'Deposit should be a number'})
      throw 'Deposit should be a number'
    }
    if(deposit.trim().length === 0){
      res.status(400).render("error",{error: 'Provide deposit of property'})
      throw 'Deposit cannot be empty string or spaces'
    }
    deposit = deposit.trim()
  
  
    let rent = xss(updatedData.rent )
    if(!rent) {
      res.status(400).render("error",{error: "Provide rent of property"})
      throw "Rent not provided"
    }
    if(!/^[0-9]+$/.test(rent)){
      res.status(400).render("error",{error: 'Rent should be a number'})
      throw 'Rent should be a number'
    }
    if(rent.trim().length === 0){
      res.status(400).render("error",{error: 'Provide rent of property'})
      throw 'Rent cannot be empty string or spaces'
    }
    rent = rent.trim()
  
  
    let ammenities = xss(updatedData.ammenities)
    if(!ammenities) {
      res.status(400).render("error",{error: "Provide ammenities of property"})
      throw "Ammenities not provided"
    }
    if(typeof ammenities != 'string'){
      res.status(400).render("error",{error: 'Ammenities should be a string'})
      throw 'Ammenities should be a string'
    }
    if(ammenities.trim().length === 0){
      res.status(400).render("error",{error: 'Provide ammenities of property'})
      throw 'Ammenities cannot be empty string or spaces'
    }
    ammenities = ammenities.trim()
    if(ammenities.length < 4){
      res.status(400).render("error",{error: 'Ammenities should be atleast 4 characters long'})
      throw 'Ammenities should be of length 4 or more'
    }
  
  
    let desc = xss(updatedData.description)
    if(!desc) {
      res.status(400).render("error",{error: "Provide description of property"})
      throw "Description of property not provided"
    }
    if(typeof desc != 'string'){
      res.status(400).render("error",{error: 'Description of property should be a string'})
      throw 'Description of property should be a string'
    }
    if(desc.trim().length === 0){
      res.status(400).render("error",{error: 'Provide description of property'})
      throw 'Description of property cannot be empty string or spaces'
    }
    desc = desc.trim()
    if(desc.length < 4){
      res.status(400).render("error",{error: 'Description of property should be atleast 4 characters long'})
      throw 'Description of property should be of length 4 or more'
    }
    

    const updatedProp = await propertiesData.updateproperty(
      id, deposit, rent, ammenities, desc
    )
    return res.redirect("/manageRentals");
  } catch (error) {
    return res.render("error", { error: error });
  }
});

router.route('/deleteProperty/:id')
.get(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  try{
    let id = req.params.id
    validation.checkId(id)
    let deleted = await propertiesData.removeListing(id)
    return res.redirect("/manageRentals")
  } catch(error) {
    return res.render('error', {error: error})
  }
});

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
    res.render("afterSearch",{result:results});
  }catch(e)
  {
    return res.render('error',{title:'Error'})
  }
  })
  .post(async (req, res) => {

    //what to validate
    select_sortBy = xss(req.body.select_sortBy)
    bed = xss(req.body.beds)
    bath = xss(req.body.baths)
    minimum = xss(req.body.minimum)
    maximum = xss(req.body.maximum)
  
  /*   bed = xss(req.body.beds)
    if(!bed) {
      res.status(400).render("error",{error: "Provide no. of bed"})
      throw "Number of beds not provided"
    }
    if(bed.trim().length === 0){
      res.status(400).render("error",{error: 'Provide no of bed'})
      throw 'number of bed cannot be empty string or spaces'
    }
    bed = bed.trim()
    if(!/^[0-9]+$/.test(bed)){
      res.status(400).render("error",{error: 'Bed should be a number'})
      throw 'Number of beds should be a number'
    }
  
    bath = xss(req.body.baths)
    if(!bath) {
      res.status(400).render("error",{error: "Provide number of bath"})
      throw "Number of bath not provided"
    }
    if(bath.trim().length === 0){
      res.status(400).render("error",{error: 'Provide number of bath'})
      throw 'Number of bath cannot be empty string or spaces'
    }
    bath = bath.trim()
    if(!/^[0-9]+$/.test(bath)){
      res.status(400).render("error",{error: 'Number of bathrooms should be a number'})
      throw 'Number of bathrooms should be a number'
    }
  
  
    //what to validate
    minimum = xss(req.body.minimum)
    if(!minimun) {
      res.status(400).render("error",{error: "Provide number of minimun"})
      throw "Number of minimun not provided"
    }
    if(minimun.trim().length === 0){
      res.status(400).render("error",{error: 'Provide number of minimun'})
      throw 'Number of minimun cannot be empty string or spaces'
    }
    minimun = minimun.trim()
    if(!/^[0-9]+$/.test(minimun)){
      res.status(400).render("error",{error: 'Number of minimun should be a number'})
      throw 'Number of minimun should be a number'
    }
  
  
    maximum = xss(req.body.maximum)
    if(!maximum) {
      res.status(400).render("error",{error: "Provide number of maximum"})
      throw "Number of maximum not provided"
    }
    if(maximum.trim().length === 0){
      res.status(400).render("error",{error: 'Provide number of maximum'})
      throw 'Number of maximum cannot be empty string or spaces'
    }
    maximum = maximum.trim()
    if(!/^[0-9]+$/.test(maximum)){
      res.status(400).render("error",{error: 'Number of maximum should be a number'})
      throw 'Number of maximum should be a number'
    }
   */
  
    try{
      
      const result = await filters.getpropertyByFilterandSort(select_sortBy,bed,bath,minimum,maximum);
      
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
    
      let user_fav = await usersData.getUserByEmail(user);
      let fav = user_fav.favourites;
      console.log(fav)
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
     // console.log(results)
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
      let userID = ObjectId(userInfo._id);
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

router.route('/contact/:id').get(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userLogin')
  let p_id = req.params.id
  validation.checkId(p_id)
  p_id = p_id.trim()
  return res.render('contact',{id:p_id,title:'Contact Page',msg:'Give yor contact details so that owner van get in touch with you!'})
});

router.route('/sent/:id').post(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userLogin')
  let sender = xss(req.body.email);
  if(!sender){
    res.status(400).render("error",{error: "Provide sender name"})
    throw "Provide sender name"
  }
  //if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) throw 'Enter valid email id'
  sender = sender.toLowerCase()
  if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sender)){
    res.status(400).render("error",{error: "Sender email should be valid"})
    throw "Sender emial should be valid"
  }
  if(sender.trim().length === 0){
    res.status(400).render("error",{error: "Sender name cannot be empty ot just spaces"})
    throw "Sender name can not be empty or just spaces"
  }
  sender = sender.trim()
  if(sender.length < 3) {
    res.status(400).render("error",{error: "Sender name should be of atleast 3 characters"})
    throw "Sender name should be of atleast 3 character"
  }


  let s_n = xss(req.body.phonenumber);
  if(!s_n){
    res.status(400).render("error",{error: "provide Sender's Number"})
    throw "Sender's Number not provided"
  }
  if(s_n.trim().length === 0){
    res.status(400).render("error",{error: "Phone number cannot be empty or just spaces"})
    throw "Phone number can not be empty or just spaces"
  }
  s_n = s_n.trim()
  if(s_n.length < 10){
    res.status(400).render("error",{error: "Phone NUmber should be of 10 digits"})
    throw 'Phone number should be of 10 digits'
  }
  if(!/^[0-9]+$/.test(s_n)) {
    res.status(400).render("error",{error: "Phone number should only contain numbers"})
    throw 'Phone number should only contain numbers'
  }


  let ids = req.params.id
  validation.checkId(ids)
  
  let owner = await propertiesData.getownerbypropId(ids)
  
  let subject='Schedule a house tour';
  let message = `${sender} is very interested in the property. Here is the contact number ${s_n}. Please get in touch to schedule a house tour`
  var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
      user:'kartikgaglani7@gmail.com',
      pass: 'hvgcmjcadlyehdfo'
    }
  })
  var mailOptions = {
    form:'kartikgaglani7@gmail.com',
    to:owner,
    subject:subject,
    text:message
  }
  transporter.sendMail(mailOptions,function(error,info){
    if(error){
      console.log(error)
    }
    else{
      return res.render('email')
    }
  })
});

/* router.route("/propertydetails/:id")
.get(async (req, res) => {
  id = xss(req.params.id)
  validation.checkId(id)

  if(isNaN(req.params.id)){
    return res.status(404).render('../views/error', {title: 'Invalid ID', Error: "Id should be a number"})
  }
}); */

router.route('/searchProperties').post(async(req,res) =>{

  let city = xss(req.body.city)
  city = city.toLowerCase()
  if(!city) {
    res.status(400).render("error",{error: "Provide city of property"})
    throw "City not provided"
  }
  if(typeof city != 'string'){
    res.status(400).render("error",{error: 'City should be a string'})
    throw 'City should be a string'
  }
  if(city.trim().length === 0){
    res.status(400).render("error",{error: 'Provide city of property'})
    throw 'City cannot be empty string or spaces'
  }
  city = city.trim()
  if(city.length < 3){
    res.status(400).render("error",{error: 'City should be atleast 3 characters long'})
    throw 'City should be of length 3 or more'
  }
  if(!/^[A-Za-z\s.,-]+$/.test(city)){
    res.status(400).render("error",{error: 'City should be only string'})
    throw 'City should be only string'
  }



  let zip = xss(req.body.zip)
  if(!zip) {
    res.status(400).render("error",{error: "Provide zip code of property"})
    throw "Zip Code not provided"
  }
  if(typeof zip != 'string'){
    res.status(400).render("error",{error: 'Zip Code should be a string'})
    throw 'Zip Code should be a string'
  }
  if(zip.trim().length === 0){
    res.status(400).render("error",{error: 'Provide zip of property'})
    throw 'Zip Code cannot be empty string or spaces'
  }
  zip = zip.trim()
  if(zip.length < 3){
    res.status(400).render("error",{error: 'Zip Code should be atleast 3 characters long'})
    throw 'Zip Code should be of length 3 or more'
  }
  if(!/^\d{5}(-\d{4})?$/.test(zip)){
    res.status(400).render("error",{error: 'Zip Code should be only string'})
    throw 'Zip Code should be only string'
  }


  let state = xss(req.body.state)
  state = state.toLowerCase()
  if(!state) {
    res.status(400).render("error",{error: "Provide state of property"})
    throw "State not provided"
  }
  if(typeof state != 'string'){
    res.status(400).render("error",{error: 'State should be a string'})
    throw 'State should be a string'
  }
  if(state.trim().length === 0){
    res.status(400).render("error",{error: 'Provide state of property'})
    throw 'State cannot be empty string or spaces'
  }
  state = state.trim()
  if(state.length < 3){
    res.status(400).render("error",{error: 'State should be atleast 3 characters long'})
    throw 'State should be of length 3 or more'
  }
  if(!/^[A-Za-z\s.,-]+$/.test(state)){
    res.status(400).render("error",{error: 'State should be only string'})
    throw 'State should be only string'
  }

  let id = [];
  try{
    if(!city && !zip && !state){
      throw 'No empty fields allowed!'
    }
    let all_prop = await filters.getByCityStateZip(city,state,zip);
   all_prop.forEach(props => {
    id.push(props._id);
   });

    return res.render('afterSearch',{id:id,result: all_prop,title:'Houses'})

  }catch(e){
    return res.render('error', {error:e, title:'Error'})
  }
});

/* router.route('/propdetails/:id').get(async(req,res) =>{
let p_id = req.params.id
validation.checkId(p_id)
p_id = p_id.trim();

try{
  let each_prop_detail = await propertiesData.getPropertyById(p_id)
  
  if(!each_prop_detail){
    return res.render('error',{title:'Error Page',error:'No properties!'})
  }
  let add = each_prop_detail.address;
  return res.render('propertyDetails',{id:p_id,address:add,city:each_prop_detail.city,state:each_prop_detail.state,zipcode:each_prop_detail.zipcode,rent:each_prop_detail.rent,deposit:each_prop_detail.deposit,bed:each_prop_detail.beds,bath:each_prop_detail.baths,amenities:each_prop_detail.ammenities, })

}catch(e){
return res.render('error',{title:'Error Page',error:'No property!'})
}

}); */
router.route("/propdetails/:id").get(async (req, res) => {
  let p_id = req.params.id;
  p_id = p_id.trim();
  try {
    let each_prop_detail = await propertiesData.getPropertyById(p_id);
    //console.log(each_prop_detail)
    if (!each_prop_detail) {
      return res.render("error", {
        title: "Error Page",
        error: "No properties!",
      });
    }
    let add = each_prop_detail.address;
    return res.render("propertyDetails", {
      id: p_id,
      address: add,
      city: each_prop_detail.city,
      state: each_prop_detail.state,
      zipcode: each_prop_detail.zipCode,
      rent: each_prop_detail.rent,
      deposit: each_prop_detail.deposit,
      bed: each_prop_detail.beds,
      bath: each_prop_detail.baths,
      amenities: each_prop_detail.ammenities,
      images:each_prop_detail.images
    });
  } catch (e) {
    return res.render("error", { title: "Error Page", error: "No property!" });
  }
});


router.route('/prop/reviews/:id').get(async(req,res)=>{
  if(!req.session.user) return res.render('/user/userLogin');
  let reviews = await reviewsData.getAllReviews(req.params.id);
  return res.render('reviewsPage',{title:'Reviews',result:reviews})
  })
  
  router.route('/prop/reviews/:id').post(async(req,res)=>{
    if(!req.session.user) return res.render('/user/userLogin');
   // if(!req.body.description) return res.render('error',{title:'Error',error:'No comment entered'})
    let createRev = await reviewsData.createReview(req.params.id,req.body.description)
    return res.render('partails/rev',{layout:null,...createRev})
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
router.route("/adminauth").get(async (req, res) => {
  // console.log("admin auth get");
  // if (req.session.user.type != "admin") return res.redirect("/user/userLogin");
  //todo add handlebar
  let propertyCollection = await properties();
  let propertyList = await propertyCollection.find({approved: false}).toArray();
  return res.render("admin", { title: "Verify Properties", result: propertyList, index: 1 });
});
router.route("/adminauth").post(async (req, res) => {
  console.log("route entered");
  // if (req.session.user.type != "admin") return res.redirect("/user/userLogin");
  // todo get all prop id in array
  console.log(req.body);
  let temp = await propertiesData.approveAuth(req.body.id);
  return res.redirect("adminauth");
  // ids.forEach(id => {
  // let temp = [];
  // for (let i = 0; i < ids.length; i++) {
  //   temp.push(await propertiesData.approveAuth(ids[i]));
  // }
  // });
  // return res.redirect("/adminauth")
});

router.route("/upload").post(upload.array("file"), async (req, res) => {
  // console.log(req.params.id)
  // console.log(req.id);
  // console.log(req);
  let id = req.body.id[0];
  let images = [];

  try {
    if (req.files.length < 3) throw `Atleast 3 images`;
    const results = await s3Uploadv2(req.files);
    console.log(results);
    results.forEach((f) => {
      images.push(f.Location);
    });
    // for(let i = 0; i< results.length; i++){
    //   images.i = results[0].location
    // }
    // console.log(req.body.id);
    console.log(images);
    // console.log(req.body.id[0]);
    const propertyCollection = await properties();
    const updatedInfo = await propertyCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { images: images } }
    );
    return res.redirect("/propdetails/" + id);
  } catch (err) {
    console.log(err);
  }
});


router.route("/adminauthno").post(async (req, res) => {
  console.log("route entered");
  // if (req.session.user.type != "admin") return res.redirect("/user/userLogin");
  // todo get all prop id in array
  console.log(req.body);
  let temp = await propertiesData.removeListing(req.body.id);
  console.log(temp);
  return res.redirect("adminauth");
});

module.exports = router;
