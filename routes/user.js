const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data/users");
const app = express();
const session = require("express-session");
const validation = require('../helpers');
const xss = require('xss');


router
  .route("/userLogin")
  .get(async (req, res) => {
    console.log('get login')
    return res.render('userLogin',{title:'Login Page'})
  
})
.post(async (req, res) => {
  try {
    let postData = xss(req.body);
    if(!postData) {
      res.status(400).json({error: "Provide user data to login"})
      throw "Data not provided to login"
    }

    let userN = postData.emailInput; 
    let pass = postData.passwordInput;

    let validUserName = validation.checkUsername(userN);
    let validPassword = validation.checkPassword(pass);
    let authenticatedUser = await data.checkUser(validUserName, validPassword);
    if (authenticatedUser.authenticatedUser != true) {
      return res
        .status(404)
        .render("userLogin", { title: "login", error: "Not authenticated" });
    }
      if (authenticatedUser.type === "admin") {
        req.session.user = validUserName;
        req.session.user.type = "admin";
        return res.redirect("/adminlist");
      }

      if (authenticatedUser.type === "buyer") {
        req.session.user = validUserName;
        req.session.user.type = "buyer";
        return res.redirect("/searchProperties");
      }
      if (authenticatedUser.type === "seller") {
        req.session.user = validUserName;
        req.session.user.type = "seller";
        return res.redirect("/propertyRegistration");
      }
      if (req.session.user) {
        res.redirect("/homepage.html");
      }
    } catch (e) {
      return res.status(400).render("userLogin", { title: "login", error: e });
    }
  });

router
  .route("/userRegistration")
  .get(async (req, res) => {
    console.log("get reg");
    try {
      const user = req.session.user;
      if (!user) {
        res.render("userRegistration", { title: "Registration Page" });
      } else {
        res.redirect("/protected");
      }
    } catch (e) {
      return res.render("userRegistration", {
        title: "Registeration Page",
        error: e,
      });
    }
  })
  .post(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/protected");
    }
    console.log(req.body);
    try {
      let postData = xss(req.body);
      let userN = postData.email;
      let pass = postData.password;
      let validUserName = validation.checkUsername(userN);
      let validPassword = validation.checkPassword(pass)

      let firstname = postData.firstName;
      if(!firstname) {
        res.status(400).json({error: "Provide firstname of user"})
        throw "Firstname not provided"
      }
      if(typeof firstname != 'string'){
        res.status(400).json({error: 'Firstname should be a string'})
        throw 'Firstname should be a string'
      }
      if(firstname.trim().length === 0){
        res.status(400).json({error: 'Provide firstname of user'})
        throw 'Firstname cannot be empty string or spaces'
      }
      firstname = firstname.trim()
      if(firstname.length < 4){
        res.status(400).json({error: 'Firstname should be atleast 4 characters long'})
        throw 'Firstname should be of length 4 or more'
      }
    


      let lastname = postData.lastName;
      if(!lastname) {
        res.status(400).json({error: "Provide lastname of user"})
        throw "Lastname not provided"
      }
      if(typeof lastname != 'string'){
        res.status(400).json({error: 'Lastname should be a string'})
        throw 'Lastname should be a string'
      }
      if(lastname.trim().length === 0){
        res.status(400).json({error: 'Provide lastname of user'})
        throw 'Lastname cannot be empty string or spaces'
      }
      lastname = lastname.trim()
      if(lastname.length < 4){
        res.status(400).json({error: 'Lastname should be atleast 4 characters long'})
        throw 'Lastname should be of length 4 or more'
      }


      let gender = postData.gender;
      if(!gender){
        res.status(400).json({error: 'Gender not provided'})
        throw 'Gender not provided'
      }


      let phonenumber = postData.phoneNumber;
      if(!phonenumber){
        res.status(400).json({error: "provide Phone Number"})
        throw "Phone Number not provided"
      }
      if(phonenumber.trim().length === 0){
        res.status(400).json({error: "Phone number cannot be empty or just spaces"})
        throw "Phone number can not be empty or just spaces"
      }
      phonenumber = phonenumber.trim()
      if(phonenumber.length < 10){
        res.status(400).json({error: "Phone NUmber should be of 10 digits"})
        throw 'Phone number should be of 10 digits'
      }
      if(!/^[0-9]+$/.test(phonenumber)) {
        res.status(400).json({error: "Phone number should only contain numbers"})
        throw 'Phone number should only contain numbers'
      }


      let type = postData.type;
      if(!type){
        res.status(400).json({error: 'Type not provided'})
        throw 'Type not provided'
      }

      let { insertedUser } = await data.createUser(
        firstname,
        lastname,
        gender,
        validUserName,
        phonenumber,
        validPassowerd,
        type
      );
      console.log(insertedUser);

      if (insertedUser) {
        console.log("if entered");
        return res.redirect("/user/userLogin");
      }
    } catch (e) {
      return res
        .status(500)
        .render("userRegistration", { title: "Register", error: e });
    }
  });

router
  .route("/peopleRent")
  .get(async (req, res) => {
    try {
      const user = req.session.user;
      if (!user) {
        res.render("userRegisteration", { title: "Registration Page" });
      } else {
        res.render("propertyRegistration", {
          title: "Enter the propety details",
        });
      }
    } catch (e) {
      return res.render("userRegisteration", {
        title: "Registeration Page",
        error: e,
      });
    }
  })
  .post(async (req, res) => {
    try {
    } catch (e) {}
  });

router.route("/peopleRent").get(async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      res.render("userRegisteration", { title: "Registration Page" });
    } else {
      res.render("propertyRegistration", {
        title: "Enter the propety details",
      });
    }
  } catch (e) {
    return res.render("userRegisteration", {
      title: "Registeration Page",
      error: e,
    });
  }
});

router.route("/protected").get(async (req, res, next) => {
  //code here for GET
  if (!req.session.admin) {
    res.status(403).render("forbiddenAccess", {
      title: "Access Denied",
      error: "Access Denied",
    });
  } else {
    return res.render("admin_handlebar", { title: "Welcome" });
  }
});

router.route("/logout").get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  //res.send('Logged out');
  return res.render("logout", {
    title: "Logout",
    message: "User has been successfully logged out",
  });
});

module.exports = router;
