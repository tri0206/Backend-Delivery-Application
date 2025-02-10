const db = require('../config/config');

const Product = {};


Product.findByCategory = (id_category) => {
    const sql = `
    SELECT
        P.id,
        P.name,
        P.description,
        P.price,
        P.image1,
        P.image2,
        P.image3,
        P.id_category
    FROM
        products AS P
    INNER JOIN
        categories AS C
    ON
        P.id_category = C.id
    WHERE
        C.id = $1
    `;

    return db.manyOrNone(sql, id_category);
}

Product.findAll = () => {
    const sql = `
        SELECT 
            p.id,
            p.name,
            p.image1 AS image_url,
            p.price AS original_price,
            COALESCE(
                CASE 
                    WHEN d.discount_type = 'percentage' THEN p.price * (1 - d.value / 100)
                    WHEN d.discount_type = 'fixed' THEN p.price - d.value
                    ELSE p.price 
                END, 
                p.price
            ) AS discounted_price
        FROM products p
        LEFT JOIN discounts d ON p.id = d.product_id
            AND NOW() BETWEEN d.start_date AND d.end_date;
    `;
    return db.manyOrNone(sql);
}

Product.findAllByRestaurant = (id_restaurant) => {
    const sql = `
        SELECT 
            p.id,
            p.name,
            p.image1,
            p.image2,
            p.image3,
            p.description,
            p.id_restaurant,
            p.id_category,
            p.price,
            COALESCE(
                CASE 
                    WHEN d.discount_type = 'fixed' THEN ROUND(p.price - d.value, 0)
                    WHEN d.discount_type = 'percentage' THEN ROUND(p.price * (1 - d.value / 100), 0)
                    ELSE p.price
                END, 
                p.price
            ) AS discount_price
        FROM products p
        LEFT JOIN discounts d ON p.id = d.product_id
            AND NOW() BETWEEN d.start_date AND d.end_date
        WHERE p.id_restaurant = $1;
    `;
    return db.manyOrNone(sql, id_restaurant);
};

Product.findDiscountProduct = () => {
    const sql = `
        SELECT 
            p.id AS id,
            p.name AS name,
            p.description,
            p.price AS original_price,
            p.image1 AS image_url,
            p.id_restaurant AS id_restaurant,
            d.discount_type,
            d.value AS discount_value,
            CASE 
                WHEN d.discount_type = 'fixed' THEN ROUND(p.price - d.value, 0)
                WHEN d.discount_type = 'percentage' THEN ROUND(p.price * (1 - d.value / 100), 0)
                ELSE p.price
            END AS discounted_price,
            p.image1
        FROM products p
        JOIN discounts d ON p.id = d.product_id
        WHERE NOW() BETWEEN d.start_date AND d.end_date;
    `;
    return db.manyOrNone(sql);
}

Product.findByRestaurant = (id_restaurant) => {
    const sql = `
    SELECT
        P.id,
        P.name,
        P.description,
        P.price,
        P.image1,
        P.image2,
        P.image3,
        P.id_category
    FROM
        products AS P
    INNER JOIN
        restaurants AS C
    ON
        P.id_restaurant = C.id_restaurant
    WHERE
        C.id_restaurant = $1
    `;

    return db.manyOrNone(sql, id_restaurant);
}


Product.findByCategoryOrName = (keyword) => {
    const sql = `
    SELECT
        P.id,
        P.name,
        P.description,
        P.price,
        P.image1,
        P.image2,
        P.image3,
        P.id_category
    FROM
        products AS P
    INNER JOIN
        categories AS C
    ON
        P.id_category = C.id
    WHERE
        P.name ILIKE '%' || $1 || '%' OR C.name ILIKE '%' || $1 || '%';
    `;
    const searchKeyword = `%${keyword}%`;
    return db.manyOrNone(sql, [searchKeyword]);
}

Product.create = (product) => {
    const sql = `
    INSERT INTO
        products(
            name,
            description,
            price,
            image1,
            image2,
            image3,
            id_category,
            id_restaurant,
            created_at,
            updated_at
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id
    `;
    return db.oneOrNone(sql, [
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        product.id_restaurant,
        new Date(),
        new Date()
    ]);
}

Product.update = (product) => {
    const sql = `
    UPDATE
        products
    SET
        name = $2,
        description = $3,
        price = $4,
        image1 = $5,
        image2 = $6,
        image3 = $7,
        id_category = $8,
        updated_at = $9
    WHERE
        id = $1
    `;
    return db.none(sql, [
        product.id,
        product.name,
        product.description,
        product.price,
        product.image1,
        product.image2,
        product.image3,
        product.id_category,
        new Date()
    ]);
}

Product.findByRestaurantAndKeyword = (id_restaurant, query) => {
    const sql = `
    SELECT 
        P.id,
        P.name,
        P.description,
        P.price,
        P.image1,
        P.image2,
        P.image3,
        P.id_category,
        P.id_restaurant
    FROM 
        products AS P
    WHERE 
        P.id_restaurant = $1 
        AND P.name ILIKE $2;
    `;
    const searchKeyword = `%${query}%`;
    return db.manyOrNone(sql, [id_restaurant, searchKeyword]);
};


module.exports = Product;