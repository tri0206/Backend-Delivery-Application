const User = require('../models/user')
const Rol = require('../models/rol')
const bcrypt = require('bcryptjs');
//const passport = require('passport')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const storage = require('../utils/cloud_storage');
const crypto = require('crypto');
//const pushNotificationController = require('../controllers/pushNotificationController');
const nodemailer = require('nodemailer');
const admin = require('firebase-admin');

const serviceAccount = require('../serviceAccountKey.json');


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
                message: 'Đã xảy ra lỗi'
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
                message: 'Đã xảy ra lỗi khi lấy dữ liệu người dùng'
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
                message: 'Đăng ký thành công',
                data: myData
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đăng ký không thành công',
                error: error
            });
        }
    },
    async registerRoles(req, res, next) {
        try {
            const id = req.body.id
            const idRole = req.body.idRole

            console.log(id + " " + idRole)
            await Rol.create(id, idRole);
            const myUser = await User.findById1(id);
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
                message: 'Đăng ký thành công',
                data: data
            })
        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đăng ký không thành công! Bạn đã đăng ký vai trò này!',
                error: error
            });
        }
    },

    async login(req, res, next) {

        try {

            const email = req.body.email;
            const password = req.body.password;
            console.log(email);
            const myUser = await User.findByEmail(email);

            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: "Email không tồn tại"
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
                    message: 'Đăng nhập thành công',
                    data: data
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'Mật khẩu không đúng!'
                })
            }

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Lỗi đăng nhập',
                error: error
            });
        }
    },

    async update(req, res, next) {

        try {

            console.log('User', req.body.user);

            const user = JSON.parse(req.body.user);
            console.log('Parsed User', user);

            const files = req.files;

            if (files.length > 0) {

                const pathImage = `image_${Date.now()}`; //FILE NAME
                const url = await storage(files[0], pathImage);

                if (url != undefined && url != null) {
                    user.image = url;
                }
            }

            const message = {
                notification: {
                    title: 'Hello',
                    body: 'This is a test notification',
                },
                token: 'd_36fzTtS0KrDQrgKH0hEK:APA91bEdhPcmi9L0THFyUw2Pa8aEFSHE1tjGelvApqWHwWWtfEkbx8q3O7IF9yznB5rMvw7hFIP6FCgTrnk4YrJytCWVSS--kamoHyoaLRe8aZznC2ptZ8s',
            };

            admin.messaging().send(message)
                .then(response => {
                    console.log('Successfully sent message:', response);
                })
                .catch(error => {
                    console.log('Error sending message:', error);
                });


            await User.update(user); // SAVING THE URL IN THE DATABASE

            return res.status(201).json({
                success: true,
                message: 'Dữ liệu người dùng đã được cập nhật thành công',
                data: user
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đã xảy ra lỗi khi cập nhật dữ liệu người dùng',
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
                message: 'Dữ liệu người dùng đã được cập nhật thành công',
                data: user
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đã xảy ra lỗi khi cập nhật dữ liệu người dùng',
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
    async resetPassword(req, res, next) {
        try {
            const email = req.body.email;
            console.log("tridoan12345", email);
            const user = await User.findByEmail(email);
            console.log(user)

            if (!user) {
                return res.status(404).json({ success: false, message: "Email not found" })
            }

            console.log(user.id)
            const newPassword = crypto.randomBytes(6).toString('hex');

            await User.resetPassword(user.id, newPassword)

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'your_email', // Email của bạn
                    pass: 'your_password'  // Mật khẩu ứng dụng email
                }
            });

            const mailOptions = {
                from: 'hduyen493@gmail.com',
                to: email,
                subject: 'Your New Password',
                text: `Your new password is: ${newPassword}`
            };

            await transporter.sendMail(mailOptions);
            res.json({ success: true, message: "New password sent to your email" });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Failed to send email" });
        }

    },
    // async updateWithoutImage(req, res, next) {

    //     try {

    //         console.log('User', req.body);

    //         const user = req.body; // CLIENTE MUST SEND US A USER OBJECT
    //         console.log('Parsed User', user);


    //         await User.update(user); // SAVING THE URL IN THE DATABASE

    //         return res.status(201).json({
    //             success: true,
    //             message: 'Dữ liệu người dùng đã được cập nhật thành công',
    //             data: user
    //         });

    //     }
    //     catch (error) {
    //         console.log(`Error: ${error}`);
    //         return res.status(501).json({
    //             success: false,
    //             message: 'Đã xảy ra lỗi khi cập nhật dữ liệu người dùng',
    //             error: error
    //         });
    //     }

    // },
    async changePassword(req, res, next) {
        try {
            const oldPassword = req.body.oldPassword;
            const newPassword = req.body.newPassword;
            const email = req.body.email;
            const myUser = await User.findByEmail(email);
            console.log(oldPassword + newPassword + email)
            const isPasswordValid = await bcrypt.compare(oldPassword, myUser.password);

            if (isPasswordValid) {

                await User.resetPassword(myUser.id, newPassword);
                return res.status(201).json({
                    success: true,
                    message: 'Đổi mật khẩu thành công!',
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'Đổi mật khẩu thất bại: Mật khẩu của bạn không đúng!'
                })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Đổi mật khẩu thất bại: Đã có lỗi xảy ra!" });
        }

    }
};
