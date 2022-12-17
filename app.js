// Setup server, session and middleware here.
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const session = require("express-session");
const multer = require("multer");
const data = require("./data");
const propertiesData = data.properties;
const { ObjectId } = require("mongodb");

// const prop_route = require('/routes/properties')
// const upload = multer({ dest: "upload/" });
require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
const { s3Uploadv2, s3Uploadv3 } = require("./s3Service");
const uuid = require("uuid").v4;
// const app = express();
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

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use("/public", static);
app.use(express.json());
app.use(
  session({
    name: "AuthCookie",
    secret: "some secret string!",
    resave: false,
    saveUninitialized: true,
  })
);
const isUserlogin = function (req) {
  return req.session.user;
};
// app.use('/propertyRegistration',prop_route)
app.use(function (req, res, next) {
  console.log(
    `[${new Date().toUTCString()}]\t${
      isUserlogin(req) ? "User Authenticated" : "User not Authenticated"
    }\t${req.originalUrl}\t${req.method}`
  );
  next();
});

// app.use('/user/userLogin',function(req,res,next){
//     if(req.session.user){
//         console.log('user  added')
//     }
//     else{
//         console.log('user not added')
//     }
//     next();
// })



// app.get("/iamgeupload/:id", async (req, res) => {
//   console.log(req.params.id);
// });

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
