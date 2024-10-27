const UsersController = require('../controllers/usersController');
const multer = require('multer');
module.exports = (app, upload) => {

    app.get('/api/users/getAll', UsersController.getAll);


    app.post('/api/users/create', UsersController.register);

    app.post('/api/users/login', UsersController.login);

    upload = multer({
        storage: multer.memoryStorage()
    });
    app.put('/api/users/update', upload.array('image', 1), UsersController.update);
}
