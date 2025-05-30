const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport')
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const io = require('socket.io')(server);
const ordersDeliverySocket = require('./sockets/orders_delivery_socket');
const admin = require('firebase-admin');

//payment
// const bodyParser = require("body-parser");
// const axios = require("axios");
// const crypto = require("crypto");

const users = require('./routes/usersRoutes');
const categories = require('./routes/categoriesRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders = require('./routes/ordersRoutes');
const discounts = require('./routes/discountsRoutes')
const restaurants = require('./routes/restaurantsRoute')

const port = process.env.PORT || 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const upload = multer({
    storage: multer.memoryStorage()
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

//payment
// app.use(bodyParser.json());

app.use(cors());
app.use(passport.initialize());
app.use(require('express-session')({
    secret: 'Enter your secret key',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);


users(app, upload);
categories(app, upload);
products(app, upload);
address(app);
orders(app);
discounts(app);
restaurants(app, upload);

ordersDeliverySocket(io);



server.listen(3000, '192.168.1.81' || 'localhost', function () {
    console.log('Aplicacion  NodeJS ' + port + ' Started...')
});

app.get('/', (req, res) => {
    res.send('Backend root route')
});

app.get('/test', (req, res) => {
    res.send('This is the route of the TEST')
});


// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err);
    res.status(err.status || 500).send(err.stack);
});

module.exports = {
    app: app,
    server: server
}


// 200 - IT IS A SUCCESSFUL RESPONSE
// 404 - IT MEANS THAT THE URL DOES NOT EXIST
// 500 - INTERNAL SERVER ERROR
