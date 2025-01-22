const db = require('../config/config');

const Restaurant = {};

Restaurant.getAll = () => {
    const sql = `
    SELECT 
        *
    FROM
        restaurants
    `;

    return db.manyOrNone(sql);
}

Restaurant.create = (restaurant) => {

    const sql = `
    INSERT INTO
        restaurants(
            id_user,
            name,
            phone,
            image,
            description,
            status,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id_restaurant
    `;

    return db.oneOrNone(sql, [
        restaurant.id_user,
        restaurant.name,
        restaurant.phone,
        restaurant.image,
        restaurant.description,
        restaurant.status,
        new Date(),
        new Date()
    ]);
}
Restaurant.update = (restaurant) => {
    const sql = `
    UPDATE
        restaurants
    SET
        id_user = $2,
        name = $3,
        phone = $4,
        image = $5,
        description = $6,
        status = $7,
        updated_at = $9
    WHERE
        id = $1
    `;
    return db.none(sql, [
        restaurant.id_restaurant,
        restaurant.id_user,
        restaurant.name,
        restaurant.phone,
        restaurant.image,
        restaurant.description,
        restaurant.status,
        new Date()
    ]);
}

Restaurant.updateStatus = (id, status) => {

    const sql = `
    UPDATE
        restaurants
    SET
        status = $2
    WHERE 
        id_restaurant = $1
    `;

    return db.none(sql, [
        id,
        status
    ]);

}

Restaurant.findRestaurantById = (id) => {
    const sql = `
    SELECT
        *
    FROM
        restaurants
    WHERE
        id_restaurant = $1
    `;

    return db.oneOrNone(sql, id);
}

Restaurant.findRestaurantByUser = (idUser) => {
    const sql = `
    SELECT
        *
    FROM
        restaurants
    WHERE
        id_user = $1
    `;

    return db.oneOrNone(sql, idUser);
}

Restaurant.findByCategory = (idCategory) => {
    const sql = `
        SELECT 
            r.id_restaurant,
            r.name,
            r.phone,
            r.description,
            r.image,
            r.status,
            c.id AS category_id,
            c.name AS category_name,
            c.image AS category_image
        FROM 
            restaurants r
        INNER JOIN 
            products p ON r.id_restaurant = p.id_restaurant
        INNER JOIN 
            categories c ON p.id_category = c.id
        WHERE 
            c.id = $1
        GROUP BY 
            r.id_restaurant, c.id
        ORDER BY 
            r.name;
    `;

    return db.manyOrNone(sql, idCategory);
};
Restaurant.findRestaurantAddress = (id_restaurant) => {
    const sql = `
            SELECT 
                a.id AS address_id,
                a.address,
                a.neighborhood,
                a.lat,
                a.lng
            FROM 
                address a
            INNER JOIN 
                restaurants r 
            ON 
                a.id_restaurant = r.id_restaurant
            WHERE 
                r.id_restaurant = $1;
    `;
    return db.manyOrNone(sql, id_restaurant);
};

module.exports = Restaurant;