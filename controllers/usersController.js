const User = require('../models/user')
const Rol = require('../models/rol')
const bcrypt = require('bcryptjs');
//const passport = require('passport')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const storage = require('../utils/cloud_storage');
module.exports = {

    async getAll(req, res, next) {
        try {
            const data = await User.getAll();
            console.log(`Infor: ${data}`);
            return res.status(201).json(data);
        } catch (error) {
            console.log(`Error: ${error}`)
            return res.status(501).json({
                success: false,
                message: 'Error obtener'
            });
        }
    },

    async findDeliveryMen(req, res, next) {
        try {
            const data = await User.findDeliveryMen();

            return res.status(201).json(data);
        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error getting users'
            });
        }
    },
    async register(req, res, next) {
        try {
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 1);
            const token = jwt.sign({ id: data.id, email: user.email }, keys.secretOrKey, {
                // expiresIn: 
            })

            const myData = {
                id: data.id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                phone: user.phone,
                image: user.image,
                session_token: `JWT ${token}`
            };
            return res.status(201).json({
                success: true,
                message: 'Register correct',
                data: myData
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'error',
                error: error
            });
        }
    },

    async login(req, res, next) {

        try {

            const email = req.body.email;
            const password = req.body.password;

            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: "Email not exist"
                })
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id: myUser.id, email: myUser.email }, keys.secretOrKey, {
                    // expiresIn: 
                })
                const data = {
                    id: myUser.id,
                    firstname: myUser.firstname,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                };

                await User.updateSessionToken(myUser.id, `JWT ${token}`);
                return res.status(201).json({
                    success: true,
                    message: 'Login Success',
                    data: data
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'Password is incorrect!'
                })
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'error login',
                error: error
            });
        }
    },

    async update(req, res, next) {

        try {

            console.log('User', req.body.user);

            const user = JSON.parse(req.body.user); // CLIENTE MUST SEND US A USER OBJECT
            console.log('Parsed User', user);

            const files = req.files;

            if (files.length > 0) { // CLIENTE SEND US A FILE

                const pathImage = `image_${Date.now()}`; //FILE NAME
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }

            }

            await User.update(user); // SAVING THE URL IN THE DATABASE

            return res.status(201).json({
                success: true,
                message: 'User data has been updated successfully',
                data: user
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error updating user data',
                error: error
            });
        }

    },

    async updateWithoutImage(req, res, next) {

        try {

            console.log('User', req.body);

            const user = req.body; // CLIENTE MUST SEND US A USER OBJECT
            console.log('Parsed User', user);


            await User.update(user); // SAVING THE URL IN THE DATABASE

            return res.status(201).json({
                success: true,
                message: 'User data has been updated successfully',
                data: user
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error updating user data',
                error: error
            });
        }

    },
    async updateNotificationToken(req, res, next) {

        try {

            const user = req.body; // CLIENTE

            await User.updateNotificationToken(user.id, user.notification_token)

            return res.status(201).json({
                success: true,
                message: 'The notification token has been stored successfully'
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error updating the notification token',
                error: error
            });
        }

    },
};