const express = require("express");
const router = express.Router();
const path = require("path");
const data = require("../data/users");
const app = express();
const session = require("express-session");

const validUserCheck = (username) => {
  if (typeof username !== "string") throw "Username must be string";
  if (username.trim().length === 0) {
    throw "Onlhy spaces not allowed";
  }
  if (username.length < 4) throw " Length should be greater than 4";
  var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!username.match(regex)) throw "Invalid Email";
  for (var i = 0; i < username.length; i++) {
    if (username[i] == " ") throw "Empty spaces are provided in Username";
  }
  return username;
};

const validatePass = (password) => {
  //if(!password) throw 'Password is not provided'
  if (typeof password != "string") throw "Password must be string";
  if (password.length < 6) throw "Password should be minimum 6 characters long";
  if (password.trim() == "") throw "Blank spaces provided";
  for (var i = 0; i < password.length; i++) {
    if (password[i] == " ") throw "Empty spaces privided in password";
  }
  if (
    !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/.test(password)
  ) {
    throw "Incorrect format of password";
  }
  return password;
};

// router
//   // .route('/')
//   // .get(async (req, res) =>{
//   //   res.sendFile(path.resolve("static/homepage.html"))
//   // })

router
.route("/userLogin")
.get(async(req,res) => {

  if(req.session.user){
    return res.render('protected')
  }
  else{
    return res.render('userLogin',{title:'Login Page'})
  }
})

.post(async (req, res) => {
  if (req.session.user) {
    res.redirect("/protected");
  }
  try {
    let postData = req.body;
    let userN = postData.email;
    let pass = postData.password;
    let validUserName = validUserCheck(userN);
    let validPassowerd = validatePass(pass);
    let authenticatedUser = await data.checkUser(validUserName, validPassowerd);
    if (authenticatedUser.authenticatedUser != true) {
      return res
        .status(404)
        .render("userLogin", { title: "login", error: "Not authenticated" });
    }

    if (authenticatedUser.type === "admin") {
      req.session.admin = validUserName;
      return res.redirect("/admin_route");
    }

    if (authenticatedUser.type === "buyer") {
      req.session.admin = validUserName;
      return res.redirect("/admin_route");
    }
  } catch (e) {
    return res.status(400).render("userLogin", { title: "login", error: e });
  }
});

router
  .route("/userRegistration")
  .get(async (req, res) => {
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
    try {
      let postData = req.body;
      let userN = postData.email;
      let pass = postData.password;
      let validUserName = validUserCheck(userN);
      let firstname = postData.firstName;
      let lastname = postData.lastname;
      let gender = postData.gender;
      let phonenumber = postData.phoneNumber;
      let type = postData.type

// todo favoitites which will be done by sanika..

      //validUserName = validUserName.toLowerCase();
      let validPassowerd = validatePass(pass);
      let { insertedUser } = await data.createUser(
        firstname,
        lastname,
        gender,
        validUserName,
        // city,
        // state,
        phonenumber,
        validPassowerd,
        type,
        favourates// i think favourites ka alag data banana  padega (get all favorites by userid)
      );
      if (insertedUser) {
        return res.redirect('/userLogin');
      }
    } catch (e) {
      return res
        .status(500)
        .render("userRegister", { title: "Register", error: e });
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

router.route("/peopleRent")
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

router.route("/peopleRent")
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
});

router.route("/protected")
  .get(async (req, res,next) => {
  //code here for GET
  if (!req.session.admin) {
    res
      .status(403)
      .render("forbiddenAccess", {
        title: "Access Denied",
        error: "Access Denied",
      });
  } else {
    return res.render("commonPage", { title: "Welcome" });
  }
});

router.route("/logout")
.get(async (req, res) => {
  //code here for GET
  req.session.destroy();
  //res.send('Logged out');
  return res.render("logout", {
    title: "Logout",
    message: "User has been successfully logged out",
  });
});

module.exports = router

