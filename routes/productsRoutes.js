const ProductsController = require('../controllers/productsController');
const passport = require('passport');

module.exports = (app, upload) => {

    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', { session: false }), ProductsController.findByCategory);

    app.get('/api/products/findByRestaurant/:id_restaurant', passport.authenticate('jwt', { session: false }), ProductsController.findByRestaurant);

    app.get('/api/products/findByCategoryOrName/:keyword', passport.authenticate('jwt', { session: false }), ProductsController.findByCategoryOrName);

    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('image', 3), ProductsController.create);
}