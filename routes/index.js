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