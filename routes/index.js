const path = require('path');
const userroutes = require('./users')

const constructorMethod = app => {
    app.use("/", userroutes);
    app.get('/about', (req, res) => {
        res.sendFile(path.resolve('static/homepage.html'));
      });

    app.use("*", (req, res) => {
        res.status(404).send("Not Found");
    });
};

module.exports = constructorMethod;