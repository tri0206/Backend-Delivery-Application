const Address = require('../models/address');


module.exports = {

    async create(req, res, next) {
        try {

            const address = req.body;
            const data = await Address.create(address);

            return res.status(201).json({
                success: true,
                message: 'Địa chỉ đã được tạo đúng',
                data: {
                    'id': data.id
                }
            });

        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đã xảy ra lỗi khi tạo địa chỉ',
                error: error
            });
        }
    },

    async findByUser(req, res, next) {
        try {

            const id_user = req.params.id_user;
            const data = await Address.findByUser(id_user);
            return res.status(201).json(data);
        }
        catch (error) {
            console.log(`Error ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Đã xảy ra lỗi',
                error: error
            });
        }
    }

}