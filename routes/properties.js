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
const xss = require('xss')

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
  limits: { fileSize: 1000000000, files: 10 },
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
  
  let propinfo = xss(req.body);

  if(!propinfo) {
    res.status(400).json({error: "Provide data to create property"})
    throw "Data not provided to create property"
  }
    
  let address = propinfo.address;
  if(!address) {
    res.status(400).json({error: "Provide address of property"})
    throw "Address not provided"
  }
  if(typeof address != 'string'){
    res.status(400).json({error: 'Address should be a string'})
    throw 'Address should be a string'
  }
  if(address.trim().length === 0){
    res.status(400).json({error: 'Provide address of property'})
    throw 'Address cannot be empty string or spaces'
  }
  address = address.trim()
  if(address.length < 4){
    res.status(400).json({error: 'Address should be atleast 4 characters long'})
    throw 'Address should be of length 4 or more'
  }


  let city = propinfo.city;
  if(!city) {
    res.status(400).json({error: "Provide city of property"})
    throw "City not provided"
  }
  if(typeof city != 'string'){
    res.status(400).json({error: 'City should be a string'})
    throw 'City should be a string'
  }
  if(city.trim().length === 0){
    res.status(400).json({error: 'Provide city of property'})
    throw 'City cannot be empty string or spaces'
  }
  city = city.trim()
  if(city.length < 3){
    res.status(400).json({error: 'City should be atleast 3 characters long'})
    throw 'City should be of length 3 or more'
  }
  if(!/^[A-Za-z\s.,-]+$/.test(city)){
    res.status(400).json({error: 'City should be only string'})
    throw 'City should be only string'
  }


  let state = propinfo.state;
  if(!state) {
    res.status(400).json({error: "Provide state of property"})
    throw "State not provided"
  }
  if(typeof state != 'string'){
    res.status(400).json({error: 'State should be a string'})
    throw 'State should be a string'
  }
  if(state.trim().length === 0){
    res.status(400).json({error: 'Provide state of property'})
    throw 'State cannot be empty string or spaces'
  }
  state = state.trim()
  if(state.length < 3){
    res.status(400).json({error: 'State should be atleast 3 characters long'})
    throw 'State should be of length 3 or more'
  }
  if(!/^[A-Za-z\s.,-]+$/.test(state)){
    res.status(400).json({error: 'State should be only string'})
    throw 'State should be only string'
  }


  let zip = propinfo.zipcode;
  if(!zip) {
    res.status(400).json({error: "Provide zip code of property"})
    throw "Zip Code not provided"
  }
  if(typeof zip != 'string'){
    res.status(400).json({error: 'Zip Code should be a string'})
    throw 'Zip Code should be a string'
  }
  if(zip.trim().length === 0){
    res.status(400).json({error: 'Provide zip of property'})
    throw 'Zip Code cannot be empty string or spaces'
  }
  zip = zip.trim()
  if(zip.length < 3){
    res.status(400).json({error: 'Zip Code should be atleast 3 characters long'})
    throw 'Zip Code should be of length 3 or more'
  }
  if(!/^\d{5}(-\d{4})?$/.test(zip)){
    res.status(400).json({error: 'Zip Code should be only string'})
    throw 'Zip Code should be only string'
  }


  let bed = propinfo.beds;
  if(!bed) {
    res.status(400).json({error: "Provide no. of bed"})
    throw "Number of beds not provided"
  }
  if(bed.trim().length === 0){
    res.status(400).json({error: 'Provide no of bed'})
    throw 'number of bed cannot be empty string or spaces'
  }
  bed = bed.trim()
  if(!/^[0-9]+$/.test(bed)){
    res.status(400).json({error: 'Bed should be a number'})
    throw 'Number of beds should be a number'
  }


  let bath = propinfo.baths;
  if(!bath) {
    res.status(400).json({error: "Provide number of bath"})
    throw "Number of bath not provided"
  }
  if(bath.trim().length === 0){
    res.status(400).json({error: 'Provide number of bath'})
    throw 'Number of bath cannot be empty string or spaces'
  }
  bath = bath.trim()
  if(!/^[0-9]+$/.test(bath)){
    res.status(400).json({error: 'Number of bathrooms should be a number'})
    throw 'Number of bathrooms should be a number'
  }


  let deposit = propinfo.deposit;
  if(!deposit) {
    res.status(400).json({error: "Provide deposit of property"})
    throw "Deposit not provided"
  }
  if(typeof deposit != 'number'){
    res.status(400).json({error: 'Deposit should be a number'})
    throw 'Deposit should be a number'
  }
  if(deposit.trim().length === 0){
    res.status(400).json({error: 'Provide deposit of property'})
    throw 'Deposit cannot be empty string or spaces'
  }
  deposit = deposit.trim()


  let rent = propinfo.rent;
  if(!rent) {
    res.status(400).json({error: "Provide rent of property"})
    throw "Rent not provided"
  }
  if(typeof rent != 'number'){
    res.status(400).json({error: 'Rent should be a number'})
    throw 'Rent should be a number'
  }
  if(rent.trim().length === 0){
    res.status(400).json({error: 'Provide rent of property'})
    throw 'Rent cannot be empty string or spaces'
  }
  rent = rent.trim()


  let ammenities = propinfo.ammenities;
  if(!ammenities) {
    res.status(400).json({error: "Provide ammenities of property"})
    throw "Ammenities not provided"
  }
  if(typeof ammenities != 'string'){
    res.status(400).json({error: 'Ammenities should be a string'})
    throw 'Ammenities should be a string'
  }
  if(ammenities.trim().length === 0){
    res.status(400).json({error: 'Provide ammenities of property'})
    throw 'Ammenities cannot be empty string or spaces'
  }
  ammenities = ammenities.trim()
  if(ammenities.length < 4){
    res.status(400).json({error: 'Ammenities should be atleast 4 characters long'})
    throw 'Ammenities should be of length 4 or more'
  }


  let desc = propinfo.description;
  if(!desc) {
    res.status(400).json({error: "Provide description of property"})
    throw "Description of property not provided"
  }
  if(typeof desc != 'string'){
    res.status(400).json({error: 'Description of property should be a string'})
    throw 'Description of property should be a string'
  }
  if(desc.trim().length === 0){
    res.status(400).json({error: 'Provide description of property'})
    throw 'Description of property cannot be empty string or spaces'
  }
  desc = desc.trim()
  if(desc.length < 4){
    res.status(400).json({error: 'Description of property should be atleast 4 characters long'})
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
      desc,
      amenities,
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
  let id = xss(req.params.id)
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
    res.render('manageProperties', {title:'Properties owned by you', OwnerName: req.session.user, result: prop})
  } catch (error) {
    return res.status(404).render('error', {error: error})
  }
}); 


//TO BE CHECK - DOESNOT SEEM TO WORK AS EXPECTED
router.route('/editProperty/:id')
.get(async (req, res) => {
  if(!req.session.user) return res.redirect('/user/userlogin')
  try{
    let id = xss(req.params.id)
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
    let id = xss(req.params.id)
    validation.checkId(id)
    let updatedData = xss(req.body)
    
    if(!updatedData) {
      res.status(400).json({error: "Provide data to update property"})
      throw "Data not provided to update property"
    }

    let deposit = updatedData.deposit
    if(!deposit) {
      res.status(400).json({error: "Provide deposit of property"})
      throw "Deposit not provided"
    }
    if(typeof deposit != 'number'){
      res.status(400).json({error: 'Deposit should be a number'})
      throw 'Deposit should be a number'
    }
    if(deposit.trim().length === 0){
      res.status(400).json({error: 'Provide deposit of property'})
      throw 'Deposit cannot be empty string or spaces'
    }
    deposit = deposit.trim()
  
  
    let rent = updatedData.rent 
    if(!rent) {
      res.status(400).json({error: "Provide rent of property"})
      throw "Rent not provided"
    }
    if(typeof rent != 'number'){
      res.status(400).json({error: 'Rent should be a number'})
      throw 'Rent should be a number'
    }
    if(rent.trim().length === 0){
      res.status(400).json({error: 'Provide rent of property'})
      throw 'Rent cannot be empty string or spaces'
    }
    rent = rent.trim()
  
  
    let ammenities = updatedData.ammenities
    if(!ammenities) {
      res.status(400).json({error: "Provide ammenities of property"})
      throw "Ammenities not provided"
    }
    if(typeof ammenities != 'string'){
      res.status(400).json({error: 'Ammenities should be a string'})
      throw 'Ammenities should be a string'
    }
    if(ammenities.trim().length === 0){
      res.status(400).json({error: 'Provide ammenities of property'})
      throw 'Ammenities cannot be empty string or spaces'
    }
    ammenities = ammenities.trim()
    if(ammenities.length < 4){
      res.status(400).json({error: 'Ammenities should be atleast 4 characters long'})
      throw 'Ammenities should be of length 4 or more'
    }
  
  
    let desc = updatedData.description
    if(!desc) {
      res.status(400).json({error: "Provide description of property"})
      throw "Description of property not provided"
    }
    if(typeof desc != 'string'){
      res.status(400).json({error: 'Description of property should be a string'})
      throw 'Description of property should be a string'
    }
    if(desc.trim().length === 0){
      res.status(400).json({error: 'Provide description of property'})
      throw 'Description of property cannot be empty string or spaces'
    }
    desc = desc.trim()
    if(desc.length < 4){
      res.status(400).json({error: 'Description of property should be atleast 4 characters long'})
      throw 'Description of property should be of length 4 or more'
    }

    const updatedProp = await propertiesData.updateListing(
      id, deposit, rent, ammenities, desc
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
    let id = xss(req.params.id)
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

router.route('/contact/:id').get(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userLogin')
  let p_id = xss(req.params.id)
  validation.checkId(p_id)
  p_id = p_id.trim()
  return res.render('contact',{id:p_id,title:'Contact Page',msg:'Give yor contact details so that owner van get in touch with you!'})
});

router.route('/sent/:id').post(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userLogin')
  let sender = xss(req.body.name);
  if(!sender){
    res.status(400).json({error: "Provide sender name"})
    throw "Provide sender name"
  }
  if(sender !== 'string'){
    res.status(400).json({error: "Sender name should be a string"})
    throw "Sender name should be a string"
  }
  if(sender.trim().length === 0){
    res.status(400).json({error: "Sender name cannot be empty ot just spaces"})
    throw "Sender name can not be empty or just spaces"
  }
  sender = sender.trim()
  if(sender.length < 3) {
    res.status(400).json({error: "Sender name should be of atleast 3 characters"})
    throw "Sender name should be of atleast 3 character"
  }


  let s_n = xss(req.body.phonenumber);
  if(!s_n){
    res.status(400).json({error: "provide Sender's Number"})
    throw "Sender's Number not provided"
  }
  if(s_n.trim().length === 0){
    res.status(400).json({error: "Phone number cannot be empty or just spaces"})
    throw "Phone number can not be empty or just spaces"
  }
  s_n = s_n.trim()
  if(s_n.length < 10){
    res.status(400).json({error: "Phone NUmber should be of 10 digits"})
    throw 'Phone number should be of 10 digits'
  }
  if(!/^[0-9]+$/.test(s_n)) {
    res.status(400).json({error: "Phone number should only contain numbers"})
    throw 'Phone number should only contain numbers'
  }


  let ids = xss(req.params.id)
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

router.route("/filters").post(async (req, res) => {

  //what to validate
  select_sortBy = xss(req.body.select_sortBy)


  bed = xss(req.body.beds)
  if(!bed) {
    res.status(400).json({error: "Provide no. of bed"})
    throw "Number of beds not provided"
  }
  if(bed.trim().length === 0){
    res.status(400).json({error: 'Provide no of bed'})
    throw 'number of bed cannot be empty string or spaces'
  }
  bed = bed.trim()
  if(!/^[0-9]+$/.test(bed)){
    res.status(400).json({error: 'Bed should be a number'})
    throw 'Number of beds should be a number'
  }

  bath = xss(req.body.baths)
  if(!bath) {
    res.status(400).json({error: "Provide number of bath"})
    throw "Number of bath not provided"
  }
  if(bath.trim().length === 0){
    res.status(400).json({error: 'Provide number of bath'})
    throw 'Number of bath cannot be empty string or spaces'
  }
  bath = bath.trim()
  if(!/^[0-9]+$/.test(bath)){
    res.status(400).json({error: 'Number of bathrooms should be a number'})
    throw 'Number of bathrooms should be a number'
  }


  //what to validate
  minimum = xss(req.body.minimum)
  if(!minimun) {
    res.status(400).json({error: "Provide number of minimun"})
    throw "Number of minimun not provided"
  }
  if(minimun.trim().length === 0){
    res.status(400).json({error: 'Provide number of minimun'})
    throw 'Number of minimun cannot be empty string or spaces'
  }
  minimun = minimun.trim()
  if(!/^[0-9]+$/.test(minimun)){
    res.status(400).json({error: 'Number of minimun should be a number'})
    throw 'Number of minimun should be a number'
  }


  maximum = xss(req.body.maximum)
  if(!maximum) {
    res.status(400).json({error: "Provide number of maximum"})
    throw "Number of maximum not provided"
  }
  if(maximum.trim().length === 0){
    res.status(400).json({error: 'Provide number of maximum'})
    throw 'Number of maximum cannot be empty string or spaces'
  }
  maximum = maximum.trim()
  if(!/^[0-9]+$/.test(maximum)){
    res.status(400).json({error: 'Number of maximum should be a number'})
    throw 'Number of maximum should be a number'
  }


  try{
    
    const result = await filters.getpropertyByFilterandSort(select_sortBy,bed,bath,minimum,maximum);
    
    res.render("afterSearch",{result: result, minimum : minimum, maximum : maximum });
  }catch(e)
  {
    return res.render('error',{title:'Error',error:'Error'})
  }
  
});


router.route("/propertydetails/:id")
.get(async (req, res) => {
  id = xss(req.params.id)
  validation.checkId(id)

  if(isNaN(req.params.id)){
    return res.status(404).render('../views/error', {title: 'Invalid ID', Error: "Id should be a number"})
  }
});

router.route('/searchProperties').post(async(req,res) =>{
  let city = xss(req.body.city)
  if(!city) {
    res.status(400).json({error: "Provide city of property"})
    throw "City not provided"
  }
  if(typeof city != 'string'){
    res.status(400).json({error: 'City should be a string'})
    throw 'City should be a string'
  }
  if(city.trim().length === 0){
    res.status(400).json({error: 'Provide city of property'})
    throw 'City cannot be empty string or spaces'
  }
  city = city.trim()
  if(city.length < 3){
    res.status(400).json({error: 'City should be atleast 3 characters long'})
    throw 'City should be of length 3 or more'
  }
  if(!/^[A-Za-z\s.,-]+$/.test(city)){
    res.status(400).json({error: 'City should be only string'})
    throw 'City should be only string'
  }



  let zip = xss(req.body.zipcode)
  if(!zip) {
    res.status(400).json({error: "Provide zip code of property"})
    throw "Zip Code not provided"
  }
  if(typeof zip != 'string'){
    res.status(400).json({error: 'Zip Code should be a string'})
    throw 'Zip Code should be a string'
  }
  if(zip.trim().length === 0){
    res.status(400).json({error: 'Provide zip of property'})
    throw 'Zip Code cannot be empty string or spaces'
  }
  zip = zip.trim()
  if(zip.length < 3){
    res.status(400).json({error: 'Zip Code should be atleast 3 characters long'})
    throw 'Zip Code should be of length 3 or more'
  }
  if(!/^\d{5}(-\d{4})?$/.test(zip)){
    res.status(400).json({error: 'Zip Code should be only string'})
    throw 'Zip Code should be only string'
  }


  let state = xss(req.body.state)
  if(!state) {
    res.status(400).json({error: "Provide state of property"})
    throw "State not provided"
  }
  if(typeof state != 'string'){
    res.status(400).json({error: 'State should be a string'})
    throw 'State should be a string'
  }
  if(state.trim().length === 0){
    res.status(400).json({error: 'Provide state of property'})
    throw 'State cannot be empty string or spaces'
  }
  state = state.trim()
  if(state.length < 3){
    res.status(400).json({error: 'State should be atleast 3 characters long'})
    throw 'State should be of length 3 or more'
  }
  if(!/^[A-Za-z\s.,-]+$/.test(state)){
    res.status(400).json({error: 'State should be only string'})
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

router.route('/propdetails/:id').get(async(req,res) =>{
let p_id = xss(req.params.id)
validation.checkId(p_id)
p_id = p_id.trim();

try{
  let each_prop_detail = await propertiesData.getPropertyById(p_id)
  
  if(!each_prop_detail){
    return res.render('error',{title:'Error Page',error:'No properties!'})
  }
  let add = each_prop_detail.address;
  return res.render('propertyDetails',{id:p_id,address:add,city:each_prop_detail.city,state:each_prop_detail.state,zipcode:each_prop_detail.zipcode,rent:each_prop_detail.rent,deposit:each_prop_detail.deposit,bed:each_prop_detail.beds,bath:each_prop_detail.baths,amenities:each_prop_detail.ammenities})

}catch(e){
return res.render('error',{title:'Error Page',error:'No property!'})
}

});

router.route("/filtered").get(async (req, res) => {
  //code here for post
  // function for filter
  try {
    let search = xss(req.body.search);
  } catch (error) {
    return res.render("error", { error: error });
  }
  return res.render("Name of the template");
});

router.route("/adminauth").get(async (req, res) => {
  if (req.session.user.type != "admin") return res.redirect("/user/userLogin");
  //todo add handlebar
  return res.render("unauthprops", { title: "Verify Properties" });
});
router.route("/adminauth").post(async (req, res) => {
  if (req.session.user.type != "admin") return res.redirect("/user/userLogin");
  // todo get all prop id in array
  // ids.forEach(id => {
  let temp = [];
  for (let i = 0; i < ids.length; i++) {
    temp.push(await propertiesData.approveAuth(ids[i]));
  }
  // });
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
    // console.log(req.body.id);
    // console.log(images);
    // console.log(req.body.id[0]);
    const propertyCollection = await properties();
    const updatedInfo = await propertyCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: { images: images } }
    );


    return res.redirect("/manageRentals");
  } catch (err) {
    console.log(err);
  }
});
module.exports = router;