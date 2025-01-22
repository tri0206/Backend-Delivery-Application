const db = require('../config/config');

const Discount = {};

Discount.create = (discount_type, value, start_date, end_date, product_id) => {

    const sql = `
    INSERT INTO
        discounts(
            discount_type,
            value,
            start_date,
            end_date,
            product_id,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6, $7)
    `;

    return db.none(sql, [
        discount_type,
        value,
        new Date(),
        new Date(),
        product_id,
        new Date(),
        new Date()
    ]);

}

module.exports = Discount;
