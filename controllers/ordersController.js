const Order = require('../models/order');
const User = require('../models/user');
const OrderHasProduct = require('../models/order_has_products');
const timeRelative = require('../utils/time_relative');
const pushNotificationController = require('./pushNotificationController');

module.exports = {


    async findByStatus(req, res, next) {

        try {
            const status = req.params.status;
            let data = await Order.findByStatus(status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            // console.log('Order: ', data);
            return res.status(201).json(data);
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'There was an error trying to get orders by state',
                error: error,
                success: false
            })
        }

    },

    async findByClientAndStatus(req, res, next) {

        try {
            const status = req.params.status;
            const id_client = req.params.id_client;
            let data = await Order.findByClientAndStatus(id_client, status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            // console.log('Order: ', data);

            return res.status(201).json(data);
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'There was an error trying to get orders by state',
                error: error,
                success: false
            })
        }

    },

    async findByDeliveryAndStatus(req, res, next) {

        try {
            const status = req.params.status;
            const id_delivery = req.params.id_delivery;
            let data = await Order.findByDeliveryAndStatus(id_delivery, status);

            data.forEach(d => {
                d.timestamp = timeRelative(new Date().getTime(), d.timestamp);
            })

            // console.log('Order: ', data);

            return res.status(201).json(data);
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                message: 'There was an error trying to get orders by state',
                error: error,
                success: false
            })
        }

    },

    async create(req, res, next) {
        try {

            let order = req.body;
            order.status = 'PAID';
            const data = await Order.create(order);

            console.log('THE ORDER WAS CREATED CORRECTLY');

            // BROWSE ALL PRODUCTS ADDED TO THE ORDER
            for (const product of order.products) {
                await OrderHasProduct.create(data.id, product.id, product.quantity);
            }

            return res.status(201).json({
                success: true,
                message: 'The order was created correctly',
                data: {
                    'id': data.id
                }
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error creating the order',
                error: error
            });
        }
    },

    async updateToDispatched(req, res, next) {
        try {

            let order = req.body;
            order.status = 'DISPATCHED';
            await Order.update(order);

            const user = await User.getNotificationTokenById(order.id_delivery);


            await pushNotificationController.sendNotification(user.notification_token, {
                title: 'ORDER ASSIGNED',
                body: 'You have been assigned an order',
                id_notification: '2'
            })

            return res.status(201).json({
                success: true,
                message: 'The order was updated successfully',
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error creating the order',
                error: error
            });
        }
    },
    async updateToOnTheWay(req, res, next) {
        try {

            let order = req.body;
            order.status = 'ON THE WAY';
            await Order.update(order);

            const user = await User.getNotificationTokenById(order.id_client);


            await pushNotificationController.sendNotification(user.notification_token, {
                title: 'YOUR ORDER IS ON THE WAY',
                body: 'A delivery person is on the way with your order.',
                id_notification: '3'
            })

            return res.status(201).json({
                success: true,
                message: 'The order was updated successfully',
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error creating the order',
                error: error
            });
        }
    },
    async updateToDelivered(req, res, next) {
        try {

            let order = req.body;
            order.status = 'DELIVERED';
            await Order.update(order);

            return res.status(201).json({
                success: true,
                message: 'The order was updated successfully',
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error creating the order',
                error: error
            });
        }
    },
    async updateLatLng(req, res, next) {
        try {

            let order = req.body;

            await Order.updateLatLng(order);

            return res.status(201).json({
                success: true,
                message: 'The order was updated successfully',
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'There was an error creating the order',
                error: error
            });
        }
    }

}
