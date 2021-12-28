//  import all of the API routes to prefix their endpoint names and package them up

const router = require('express').Router();
const userRoutes = require('./user-routes');
// const pizzaRoutes = require('./pizza-routes');

router.use('/users', userRoutes);
// // add prefix of '/pizzas' to routes created in 'pizza-routes.js'
// router.use('/pizzas', pizzaRoutes);


module.exports = router;