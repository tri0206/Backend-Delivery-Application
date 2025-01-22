DROP TABLE IF EXISTS roles
CASCADE;
CREATE TABLE roles
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    route VARCHAR(255) NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);


DROP TABLE IF EXISTS users
CASCADE;
CREATE TABLE users
(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    phone VARCHAR(80) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(255) NOT NULL,
    is_available BOOLEAN NULL,
    session_token VARCHAR(255) NULL,
    notification_token VARCHAR(255) NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS user_has_roles
CASCADE;
CREATE TABLE user_has_roles
(
    id_user BIGSERIAL NOT NULL,
    id_rol BIGSERIAL NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(id_user, id_rol)
);


INSERT INTO roles
    (
    name,
    route,
    image,
    created_at,
    updated_at
    )
VALUES(
        'CLIENT',
        'client/home',
        'https://s.net.vn/QSYW',
        '2024-10-20',
        '2024-10-20'	
);

INSERT INTO roles
    (
    name,
    route,
    image,
    created_at,
    updated_at
    )
VALUES(
        'RESTAURANT',
        'restaurent/home',
        'https://cdn-icons-png.flaticon.com/512/6643/6643359.png',
        '2024-10-20',
        '2024-10-20'	
);


INSERT INTO roles
    (
    name,
    route,
    image,
    created_at,
    updated_at
    )
VALUES(
        'REPARTITION',
        'delivery/home',
        'https://firebasestorage.googleapis.com/v0/b/kotlin-delivery-79773.appspot.com/o/delivery_man.png?alt=media&token=d6bea295-25fc-4645-8f27-1c05023f4ce8',
        '2024-10-20',
        '2024-10-20'	
);


DROP TABLE IF EXISTS categories
CASCADE;
CREATE TABLE categories
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);
DROP TABLE IF EXISTS products
CASCADE;
CREATE TABLE products
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    description VARCHAR(255) NOT NULL,
    price DECIMAL DEFAULT 0,
    image1 VARCHAR(255) NULL,
    image2 VARCHAR(255) NULL,
    image3 VARCHAR(255) NULL,
    id_category BIGINT NOT NULL,
    id_restaurant BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_restaurant) REFERENCES restaurants(id_restaurant) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS address
CASCADE;
CREATE TABLE address
(
    id BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL,
    id_restaurant BIGINT,
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(255) NOT NULL,
    lat DECIMAL DEFAULT 0,
    lng DECIMAL DEFAULT 0,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_restaurant) REFERENCES restaurants(id_restaurant) ON UPDATE CASCADE ON DELETE CASCADE
);
DROP TABLE IF EXISTS orders
CASCADE;
CREATE TABLE orders
(
    id BIGSERIAL PRIMARY KEY,
    id_client BIGINT NOT NULL,
    id_delivery BIGINT NULL,
    id_address BIGINT NOT NULL,
    id_restaurant INT NOT NULL,
    lat DECIMAL DEFAULT 0,
    lng DECIMAL DEFAULT 0,
    status VARCHAR(90) NOT NULL,
    timestamp BIGINT NOT NULL,
    note VARCHAR(255) NULL,
    payment VARCHAR(255) NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_restaurant) REFERENCES restaurants(id_restaurant) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS order_has_products
CASCADE;
CREATE TABLE order_has_products
(
    id_order BIGINT NOT NULL,
    id_product BIGINT NOT NULL,
    quantity BIGINT NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    PRIMARY KEY(id_order, id_product),
    FOREIGN KEY(id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS discounts
CASCADE;
CREATE TABLE discounts
(
    id SERIAL PRIMARY KEY,
    discount_type VARCHAR
(50) NOT NULL,
    value NUMERIC
(10, 2),
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    product_id INT REFERENCES products
(id),
    created_at TIMESTAMP DEFAULT NOW
(),
    updated_at TIMESTAMP DEFAULT NOW
()
);

DROP TABLE IF EXISTS restaurants
CASCADE;
CREATE TABLE restaurants
(
    id_restaurant SERIAL PRIMARY KEY,
    id_user INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);