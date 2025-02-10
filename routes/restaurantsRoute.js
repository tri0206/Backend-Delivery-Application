const RestaurantsController = require('../controllers/restaurantsController');
const passport = require('passport');

module.exports = (app, upload) => {

    // app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', { session: false }), ProductsController.findByCategory);

    // app.get('/api/products/findByCategoryOrName/:keyword', passport.authenticate('jwt', { session: false }), ProductsController.findByCategoryOrName);

    app.post('/api/restaurants/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), RestaurantsController.create);

    app.post('/api/restaurants/updateStatus', RestaurantsController.updateStatus);

    app.post('/api/restaurants/findByUser', RestaurantsController.findRestaurantByUser);

    app.post('/api/restaurants/findById', RestaurantsController.findRestaurantById);

    app.get('/api/restaurants/findByQuery/:query', passport.authenticate('jwt', { session: false }), RestaurantsController.findByQuery);

    // app.post('/api/restaurants/findByCategory', RestaurantsController.findRestaurantByCategory);
    app.get('/api/restaurants/findByCategory/:idCategory', passport.authenticate('jwt', { session: false }), RestaurantsController.findRestaurantByCategory);
}