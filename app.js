// Setup server, session and middleware here.
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const exphbs = require("express-handlebars");
const static = express.static(__dirname + "/public");
const configRoutes = require("./routes");
const session = require("express-session")
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set("view engine", "handlebars");
app.use("/public", static);
app.use(express.json())
app.use(session({
    name: 'AuthCookie',
    secret: 'some secret string!',
    resave: false,
    saveUninitialized: true
}));
const isUserlogin = function (req) {
    return req.session.user;
};

app.use(function (req, res, next) {
    console.log(`[${new Date().toUTCString()}]\t${isUserlogin(req) ? 'User Authenticated' : 'User not Authenticated' }\t${req.originalUrl}\t${req.method}`)
    next();
});



    configRoutes(app);

app.listen(3000, () => {
    console.log("We've now got a server!");
    console.log("Your routes will be running on http://localhost:3000");
});