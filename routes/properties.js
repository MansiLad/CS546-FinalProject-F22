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
const validation = require("../helpers");
const nodemailer = require("nodemailer");
const usersData = data.users;

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
  //code here for post
  // console.log(req.body);
  // console.log(req.file)
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
  let user = req.session.user;
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
      amenities
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

router.route("/manageRentals").get(async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userlogin");
  try {
    let prop = await propertiesData.getPropertybyOwner(req.session.user);
    console.log(prop);
    res.render("manageProperties", {
      title: "Properties owned by you",
      OwnerName: req.session.user,
      result: prop,
    });
  } catch (error) {
    return res.status(404).render("error", { error: error });
  }
});

router
  .route("/editProperty/:id")
  .get(async (req, res) => {
    if (!req.session.user) return res.redirect("/user/userlogin");
    try {
      id = validation.checkId(req.params.id);

      const prop = await propertiesData.getPropertyById(id);

      return res.render("propertyEdit", {
        title: "Edit Property",
        property: prop,
      });
    } catch (error) {
      return res.status(404).render("error", { error: error });
    }
  })
  .post(async (req, res) => {
    if (!req.session.user) return res.redirect("/user/userlogin");
    try {
      id = validation.checkId(req.params.id);
      let updatedData = req.body;
      const updatedProp = await propertiesData.updateListing(
        updatedData.propertyId,
        updatedData.address,
        updatedData.city,
        updatedData.state,
        updatedData.zipcode,
        updatedData.beds,
        updatedData.baths,
        updatedData.deposit,
        updatedData.rent,
        updatedData.ammenities,
        updatedData.available
      );
      return res.redirect("/manageRentals");
    } catch (error) {
      console.log(error);
      return res.render("error", { error: error });
    }
  });

router.route("/deleteProperty/:id").get(async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userlogin");
  try {
    let deleted = await propertiesData.removeListing(req.params.id);
    return res.redirect("/manageRentals");
  } catch (error) {
    return res.render("error", { error: error });
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

router.route("/searchProperties").get(async (req, res) => {
  try {
    res.render("searchProp", { title: "Get your favourite properties!" });
  } catch (error) {
    return res.render("error", { error: error });
  }
});

router.route("/filters").get(async (req, res) => {
  try {
    const results = await filters.getAllproperties();
    //console.log(results);
    res.render("afterSearch", { result: results });
  } catch (e) {
    return res.render("error", { title: "Error" });
  }
});

router.route("/prop/reviews/:id").get(async (req, res) => {
  if (!req.session.user) return res.render("/user/userLogin");
  let reviews = await reviewsData.getAllReviews(req.params.id);
  return res.render("reviewsPage", { title: "Reviews", result: reviews });
});

router.route("/prop/reviews/:id").post(async (req, res) => {
  if (!req.session.user) return res.render("/user/userLogin");
  let createRev = await reviewsData.createReview(
    req.params.id,
    req.body.description
  );
  return res.render("partails/rev", { layout: null, ...createRev });
});

router.route("/filters").post(async (req, res) => {
  //console.log(req.body);
  // search_location= req.body.search_location;
  select_sortBy = req.body.select_sortBy;
  beds = req.body.beds;
  baths = req.body.baths;
  minimum = req.body.minimum;
  maximum = req.body.maximum;
  try {
    const result = await filters.getpropertyByFilterandSort(
      select_sortBy,
      beds,
      baths,
      minimum,
      maximum
    );
    //console.log(result);
    res.render("afterSearch", {
      result: result,
      minimum: minimum,
      maximum: maximum,
    });
  } catch (e) {
    return res.render("error", { title: "Error", error: "Error" });
  }
});

router.route("/favourites").get(async (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.render("userLogin", { title: "Login Page" });
  } else {
    let emailId = req.session.user;
    let user_fav = await usersData.getUserByEmail(user);
    let fav = user_fav.favourites;
    results = [];
    if (fav === 0) {
      res.render("favourites", { error: "No properties added yet!" });
    }
    fav.forEach(async (propId) => {
      // console.log(propId);
      property = await propertiesData.getPropertyById(propId);
      // console.log(property);
      results.push(property);
    });
    // console.log(results)
    results = JSON.parse(JSON.stringify(results));
    try {
      res.render("favourites", { results: results });
    } catch (e) {
      console.log(e);
    }
  }
});

router.route("/contact/:id").get(async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userLogin");
  let p_id = req.params.id;
  p_id = p_id.trim();
  return res.render("contact", {
    id: p_id,
    title: "Contact Page",
    msg: "Give yor contact details so that owner van get in touch with you!",
  });
});

router.route("/sent/:id").post(async (req, res) => {
  if (!req.session.user) return res.redirect("/user/userLogin");
  let sender = req.body.name;
  let s_n = req.body.phonenumber;
  let ids = req.params.id;
  console.log(ids);
  let owner = await propertiesData.getownerbypropId(ids);
  console.log(owner);
  let subject = "Schedule a house tour";
  let message = `${sender} is very interested in the property. Here is the contact number ${s_n}. Please get in touch to schedule a house tour`;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "kartikgaglani7@gmail.com",
      pass: "hvgcmjcadlyehdfo",
    },
  });
  var mailOptions = {
    form: "kartikgaglani7@gmail.com",
    to: owner,
    subject: subject,
    text: message,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.render("email");
    }
  });
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

router.route("/ownedProperties").get(async (req, res) => {
  //code here for GET
  //let prop_det = req.body.
  try {
    let prop = await propertiesData.getPropOwnerbyId(req.params.id);
    res.render("allProperties", {
      title: "Properties owned by you",
      OwnerName: req.params.id,
      result: prop,
    });
  } catch (error) {
    return res.render("error", { error: error });
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

router.route("/removelisting").delete(async (req, res) => {
  //code here for post
  id = req.params.id;
  id = helper.chekId(id);
  try {
    await propertiesData.removeListing(id);
    res.redirect("/manageProperties");
  } catch (error) {
    return res.render("error", { error: error });
  }
});

router.route("/searchProperties").post(async (req, res) => {
  let city = req.body.city;
  let zip = req.body.zip;
  let state = req.body.state;
  let id = [];
  try {
    if (!city && !zip && !state) {
      throw "No empty fields allowed!";
    }
    let all_prop = await filters.getByCityStateZip(city, state, zip); //[{},{}]
    //console.log(all_prop)
    all_prop.forEach((props) => {
      id.push(props._id);
    });
    return res.render("afterSearch", {
      id: id,
      result: all_prop,
      title: "Houses",
    });
  } catch (e) {
    return res.render("error", { error: e, title: "Error" });
  }
});

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
    return res.redirect("/propdetails/" + id);
  } catch (err) {
    console.log(err);
  }
});


// router.route("/adminauth2").get(async (req, res) => {
//   // console.log("admin auth get");
//   // if (req.session.user.type != "admin") return res.redirect("/user/userLogin");
//   //todo add handlebar
//   let propertyCollection = await properties();
//   let propertyList = await propertyCollection.find({approved: false}).toArray();
//   return res.render("admin", { title: "auth", result: propertyList, index: 1 });
// });
// router.route("/adminauth2").post(async (req, res) => {
//   console.log("route entered");
//   // if (req.session.user.type != "admin") return res.redirect("/user/userLogin");
//   // todo get all prop id in array
//   console.log(req.body);
//   let temp = await propertiesData.approveAuth(req.body.id);
//   return res.redirect("admin a");
  // ids.forEach(id => {
  // let temp = [];
  // for (let i = 0; i < ids.length; i++) {
  //   temp.push(await propertiesData.approveAuth(ids[i]));
  // }
  // });
  // return res.redirect("/adminauth")
// });

module.exports = router;
