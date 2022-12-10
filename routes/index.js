//Here you will require both route files and export the constructor method as shown in lecture code where there is more than one route file. Look at lecture 6 lecture code for example

// when the route is /movies use the routes defined in movies.js routing file, when the route is /reviews use the routes defined in reviews.js routing file, all other enpoints should return a 404 as shown in the lecture code.

const properties_routes = require("./properties");
const reviews_Routes = require("./reviews");
const user_Routes = require("./user");

const constructor = (app) => {
    //app.use("/", redirect)
    app.use("/", properties_routes);
    app.use("/reviews", reviews_Routes);
    app.use("/user",user_Routes);
   // app.use("/",user_Routes);

    //for accessing unknown routes
    app.use("*", (request, response) => {
        response.status(404).json({ serverResponse: "Not found." });
    });

};

module.exports = constructor;