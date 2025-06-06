const db = require('../config/config');

const Address = {};

Address.findByUser = (id_user) => {

    const sql = `
    SELECT
        id,
        id_user,
        address,
        neighborhood,
        lat,
        lng
    FROM
        address
    WHERE
        id_user = $1
    `;

    return db.manyOrNone(sql, id_user)

}

Address.findByRestaurant = (id_restaurant) => {

    const sql = `
    SELECT
        id,
        id_user,
        address,
        neighborhood,
        lat,
        lng
    FROM
        address
    WHERE
        id_restaurant = $1
    `;

    return db.manyOrNone(sql, id_restaurant)

}

Address.create = (address) => {
    const sql = `
    INSERT INTO
        address(
            id_user,
            address,
            neighborhood,
            lat,
            lng,
            id_restaurant,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;

    return db.oneOrNone(sql, [
        address.id_user,
        address.address,
        address.neighborhood,
        address.lat,
        address.lng,
        address.id_restaurant,
        new Date(),
        new Date()
    ]);
}

module.exports = Address;