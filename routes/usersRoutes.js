const UsersController = require('../controllers/usersController');
const multer = require('multer');
const passport = require('passport')
module.exports = (app, upload) => {
    upload = multer({
        storage: multer.memoryStorage()
    });


    app.get('/api/users/getAll', UsersController.getAll);
    app.get('/api/users/findDeliveryMen', passport.authenticate('jwt', { session: false }), UsersController.findDeliveryMen);

    app.post('/api/users/create', UsersController.register);
    app.post('/api/users/registerRoles', UsersController.registerRoles);
    app.post('/api/users/resetPassword', UsersController.resetPassword);
    app.post('/api/users/login', UsersController.login);
    app.post('/api/users/changePassword', UsersController.changePassword);



    app.put('/api/users/update', passport.authenticate('jwt', { session: false }), upload.array('image', 1), UsersController.update);
    app.put('/api/users/updateWithoutImage', passport.authenticate('jwt', { session: false }), UsersController.updateWithoutImage);
    app.put('/api/users/updateNotificationToken', passport.authenticate('jwt', { session: false }), UsersController.updateNotificationToken);
}
