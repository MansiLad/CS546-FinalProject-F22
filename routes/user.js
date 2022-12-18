const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data/users");
const app = express();
const session = require("express-session");
const validation = require('../helpers');
const xss = require('xss');


// router
//   // .route('/')
//   // .get(async (req, res) =>{
//   //   res.sendFile(path.resolve("static/homepage.html"))
//   // })

router
  .route("/userLogin")
  .get(async (req, res) => {
    
  // if(req.session.user){
  //   return res.render('commonPage')
  // }
  // else{
    console.log('get login')
    return res.render('userLogin',{title:'Login Page'})
  // }
})

.post(async (req, res) => {
  
  try {
    let postData = req.body;
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
        res.redirect("/protected");
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
    // console.log('post reg')
    if (req.session.user) {
      return res.redirect("/protected");
    }
    console.log(req.body);
    try {
      let postData = req.body;
      let userN = postData.email;
      let pass = postData.password;
      let validUserName = validation.checkUsername(userN);
      let firstname = postData.firstName;
      let lastname = postData.lastName;
      let gender = postData.gender;
      let phonenumber = postData.phoneNumber;
      let type = postData.type;

      // todo favoitites which will be done by sanika..

      //validUserName = validUserName.toLowerCase();
      let validPassowerd = validation.checkPassword(pass);
      let { insertedUser } = await data.createUser(
        firstname,
        lastname,
        gender,
        validUserName,
        // city,
        // state,
        phonenumber,
        validPassowerd,
        type
        //favourates// i think favourites ka alag data banana  padega (get all favorites by userid)
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

// router
//   .route("/propertyRegistration")
//   .get(async (req, res) => {
//     try {
//       const user = req.session.user;
//       if (!user) {
//         res.render("userRegisteration", { title: "Registration Page" });
//       } else {
//         res.render("propertyRegistration", {
//           title: "Enter the propety details",
//         });
//       }
//     } catch (e) {
//       return res.render("userRegisteration", {
//         title: "Registeration Page",
//         error: e,
//       });
//     }
//   })
//   .post(async (req, res) => {
//     try {
//     } catch (e) {}
//   });

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
