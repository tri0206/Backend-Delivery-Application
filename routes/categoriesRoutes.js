const CategoriesController = require('../controllers/categoriesController');
const passport = require('passport');

module.exports = (app, upload) => {

    // BRING DATA
    app.get('/api/categories/getAll', passport.authenticate('jwt', { session: false }), CategoriesController.getAll);

    // SAVE DATA
    app.post('/api/categories/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), CategoriesController.create);


}