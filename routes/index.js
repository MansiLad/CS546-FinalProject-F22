const propertiesRoutes = require('./properties');
// const reviewsRoutes = require('./reviews');

const constructorMethod = (app) => {
  app.use('/properties', moviesRoutes);
  // app.use('/reviews', reviewsRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;