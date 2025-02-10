const Restaurant = require('../models/restaurant')
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach');
const { log } = require('util');

module.exports = {

    async create(req, res, next) {

        console.log("tridoan");

        try {
            let restaurant = JSON.parse(req.body.restaurant);
            const files = req.files;

            console.log(restaurant);
            if (files.length > 0) {
                const pathImage = `image_${Date.now()}`;
                const url = await storage(files[0], pathImage);
                if (url != undefined && url != null) {
                    restaurant.image = url;
                }
            }

            const data = await Restaurant.create(restaurant);
            const myData = {
                id_restaurant: data.id_restaurant,
                id_user: restaurant.id_user,
                name: restaurant.name,
                description: restaurant.description,
                phone: restaurant.phone,
                image: restaurant.image,
                status: restaurant.status
            };
            return res.status(201).json({
                success: true,
                message: 'Nhà hàng đã được đăng ký thành công',
                data: myData
            });

        } catch (error) {
            console.log(`Error: ${error}`);
            return res.status(500).json({
                message: `Lỗi khi đăng ký nhà hàng: ${error}`,
                success: false,
                error
            });
        }
    },

    async updateStatus(req, res, next) {

        try {

            const restaurant = req.body;

            await Restaurant.updateStatus(restaurant.id, restaurant.status)
            const data = await Restaurant.findRestaurantById(restaurant.id);
            const myData = {
                id_restaurant: data.id_restaurant,
                id_user: data.id_user,
                name: data.name,
                description: data.description,
                phone: data.phone,
                image: data.image,
                status: data.status
            };
            return res.status(201).json({
                success: true,
                message: 'Cập nhật trạng thái thành công!',
                data: myData
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đã xảy ra lỗi',
                error: error
            });
        }
    },

    async findRestaurantByUser(req, res, next) {

        try {

            const restaurant = req.body;

            const data = await Restaurant.findRestaurantByUser(restaurant.idUser);
            const myData = {
                id_restaurant: data.id_restaurant,
                id_user: data.id_user,
                name: data.name,
                description: data.description,
                phone: data.phone,
                image: data.image,
                status: data.status
            };
            return res.status(201).json({
                success: true,
                message: 'Cập nhật trạng thái thành công!',
                data: myData
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đã xảy ra lỗi',
                error: error
            });
        }
    },

    async findRestaurantById(req, res, next) {

        try {

            const restaurant = req.body;

            const data = await Restaurant.findRestaurantById(restaurant.idRestaurant);
            const address = await Restaurant.findAddress(restaurant.idRestaurant)
            const myData = {
                id_restaurant: data.id_restaurant,
                id_user: data.id_user,
                name: data.name,
                description: data.description,
                phone: data.phone,
                image: data.image,
                status: data.status,
                res_address: address.address,
                res_neighborhood: address.neighborhood,
                lat: address.lat,
                lng: address.lng
            };
            return res.status(201).json({
                success: true,
                message: 'Thành công!',
                data: myData
            });

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đã xảy ra lỗi',
                error: error
            });
        }
    },

    async findRestaurantByCategory(req, res, next) {

        try {
            const idCategory = req.params.idCategory;
            console.log("id: " + req.params.idCategory)
            const restaurants = await Restaurant.findByCategory(idCategory);
            const restaurantData = await Promise.all(
                restaurants.map(async (restaurant) => {
                    const addressArray = await Restaurant.findRestaurantAddress(restaurant.id_restaurant);

                    // Kiểm tra nếu mảng address không rỗng
                    if (addressArray && addressArray.length > 0) {
                        const address = addressArray[0]; // Lấy phần tử đầu tiên trong mảng

                        return {
                            id_restaurant: restaurant.id_restaurant,
                            name: restaurant.name,
                            description: restaurant.description,
                            phone: restaurant.phone,
                            image: restaurant.image,
                            status: restaurant.status,
                            res_address: address.address, // Địa chỉ
                            res_neighborhood: address.neighborhood, // Khu vực
                            lat: address.lat, // Vĩ độ
                            lng: address.lng  // Kinh độ
                        };
                    } else {
                        return {
                            id_restaurant: restaurant.id_restaurant,
                            name: restaurant.name,
                            description: restaurant.description,
                            phone: restaurant.phone,
                            image: restaurant.image,
                            status: restaurant.status,
                            res_address: "No Address Available",
                            res_neighborhood: "No Neighborhood Available",
                            lat: null,
                            lng: null
                        };
                    }
                })
            );

            return res.status(201).json(restaurantData);

        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đã xảy ra lỗi',
                error: error
            });
        }
    },

    async findByQuery(req, res, next) {
        try {
            const keyword = req.params.query;
            console.log(keyword);
            const restaurants = await Restaurant.findByKeyword(keyword);
            const restaurantData = await Promise.all(
                restaurants.map(async (restaurant) => {
                    const addressArray = await Restaurant.findRestaurantAddress(restaurant.id_restaurant);

                    // Kiểm tra nếu mảng address không rỗng
                    if (addressArray && addressArray.length > 0) {
                        const address = addressArray[0]; // Lấy phần tử đầu tiên trong mảng

                        return {
                            id_restaurant: restaurant.id_restaurant,
                            name: restaurant.name,
                            description: restaurant.description,
                            phone: restaurant.phone,
                            image: restaurant.image,
                            status: restaurant.status,
                            res_address: address.address, // Địa chỉ
                            res_neighborhood: address.neighborhood, // Khu vực
                            lat: address.lat, // Vĩ độ
                            lng: address.lng  // Kinh độ
                        };
                    } else {
                        return {
                            id_restaurant: restaurant.id_restaurant,
                            name: restaurant.name,
                            description: restaurant.description,
                            phone: restaurant.phone,
                            image: restaurant.image,
                            status: restaurant.status,
                            res_address: "No Address Available",
                            res_neighborhood: "No Neighborhood Available",
                            lat: null,
                            lng: null
                        };
                    }
                })
            );
            return res.status(201).json(restaurantData);
        }
        catch (error) {
            console.log(`Error: ${error}`);
            return res.status(501).json({
                message: `Error listing restaurant by query`,
                success: false,
                error: error
            });
        }
    },
}