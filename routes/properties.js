const express = require("express");
const router = express.Router();
const data = require("../data");
const propertiesData = data.properties;
const reviewsData = data.reviews;
const filters = data.filters;
const path = require("path");
const validation = require('../helpers')
const nodemailer = require('nodemailer');
const { title } = require("process");

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

router.route("/propertyRegistration").get(async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userlogin");
  return res.render("propertyRegistration", {
    title: "Resgister your property here!",
  });
});

router.route("/propertyRegistration").post(async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userlogin");
  console.log(req);
  let address = req.body.address;
  let city = req.body.city;
  let state = req.body.state;
  let zip = req.body.zip;
  let bed = req.body.beds;
  let bath = req.body.baths;
  let deposit = req.body.deposit;
  let rent = req.body.rent;
  let amenities = req.body.amenities;
  let desc = req.body.description;
  let user = req.session.user
  console.log("route entered");
  // let images = req.body.images;

  try {
    let insertedProp = await propertiesData.createListing(
      user,
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

router.route("/imageupload/:id").get(async (req, res) => {
  console.log(req.params.id);
  return res.render("imageupload", { title: "Upload", id: req.params.id });
  // return res.sendFile(path.resolve("static/upload.html"));
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
    console.log(req.params.id)
    id = validation.checkId(req.params.id)
    let updatedData = req.body
    console.log(updatedData)
    const updatedProp = await propertiesData.updateListing(
      id, updatedData.address, updatedData.city,
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
  transporter.sendMail(mailOptions,function(error,info){
    if(error){
      //return res.render('error',{title:'Error page',})
      return res.redirect('contact',{title:'Contact Page',msg:'Email not sent provide details again'})
    }
    else{
      return res.render('email')
    }
  })
  })

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
    let all_prop = await filters.getByCityStateZip(city,state,zip);//[{},{}]
    //console.log(all_prop)
   all_prop.forEach(props => {
    id.push(props._id);
   });
      return res.render('afterSearch',{id:id,result: all_prop,title:'Houses'})
  }catch(e){
    return res.render('error', {error:e, title:'Error'})
  }
});

router.route('/propdetails/:id').get(async(req,res) =>{
  let p_id = req.params.id
  p_id = p_id.trim();
  try{
    let each_prop_detail = await data_people.searchPeopleByID(p_id)

  }catch(e){
  return res.render('error',{title:'Error Page',error:'No property!'})
  }
})

router.route('/prop/reviews/:id').get(async(req,res)=>{
  if(!req.session.user) return res.redirect('/user/userLogin');
  let p_id = req.params.id;
  p_id=p_id.trim()
  let reviews_get = await reviewsData.getAllReviews(p_id)
  return res.render('reviewsPage',{title:'Reviews of this property',result:reviews_get})
})

router.route('/prop/reviews/:id').post(async(req,res)=>{
  let review_post = req.body.review;
  let p_id = req.params.id;
  p_id = p_id.trim()
  let reviews_create = await reviewsData.createReview(p_id,review_post);
  response.render('partials/rev', {result:reviews_create});
})

router.route("/removelisting").delete(async (req, res) => {
  //code here for post
  id = req.params.id;
  id = helper.chekId(id);
  try {
    await propertiesData.removeListing(id);
    res.redirect("/properties");
  } catch (error) {
    return res.render("error", { error: error });
  }
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

  // let prop = propertiesData.getPropertyById(ObjectId(id));

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
